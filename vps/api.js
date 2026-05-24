const express = require("express");
const puppeteer = require("puppeteer-core");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(express.json());

const supabase = createClient(
  "https://pmxhnefmuvgavwrmjmfw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBteGhuZWZtdXZnYXZ3cm1qbWZ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzkyODU3NiwiZXhwIjoyMDUzNTA0NTc2fQ.vaWIIrIzoLhehy0rSFLI2454-ASy_-lXtzeKg2SOoMU"
);

app.get("/health", (req, res) => res.json({ ok: true }));

app.post("/sync", async (req, res) => {
  const { email, password, member_id } = req.body;
  if (!email || !password) return res.status(400).json({ error: "email and password required" });

  let browser;
  try {
    browser = await puppeteer.launch({ executablePath: "/usr/bin/chromium-browser", args: ["--no-sandbox", "--disable-setuid-sandbox"] });
    const page = await browser.newPage();
    await page.goto("https://www.eticketing.co.uk/chelseafc/Authentication/Login", { waitUntil: "networkidle2", timeout: 90000 });

    const emailSelectors = ['input[name="ctl00$ContentPlaceHolder1$Login1$UserName"]', 'input[type="email"]', '#UserName', 'input[name*="UserName"]'];
    const passSelectors = ['input[name="ctl00$ContentPlaceHolder1$Login1$Password"]', 'input[type="password"]', '#Password', 'input[name*="Password"]'];

    for (const sel of emailSelectors) {
      try { await page.type(sel, email); break; } catch {}
    }
    for (const sel of passSelectors) {
      try { await page.type(sel, password); break; } catch {}
    }

    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 90000 }),
      page.keyboard.press("Enter")
    ]);

    if (page.url().includes("Login")) {
      await browser.close();
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accountUrls = [
      "https://www.eticketing.co.uk/chelseafc/Account/Overview",
      "https://www.eticketing.co.uk/chelseafc/Account",
      "https://www.eticketing.co.uk/chelseafc/MyAccount"
    ];

    let loyalty_points = null;
    let membership_tier = null;

    for (const url of accountUrls) {
      await page.goto(url, { waitUntil: "networkidle2", timeout: 90000 }).catch(() => {});
      const text = await page.evaluate(() => document.body.innerText);

      const pointsMatch = text.match(/(\d[\d,]*)\s*(?:LOYALTY\s*)?POINTS?/i);
      if (pointsMatch) loyalty_points = parseInt(pointsMatch[1].replace(/,/g, ""));

      const tiers = ["Blue Pitch", "Gold", "Silver", "Platinum", "True Blue", "One Club"];
      for (const tier of tiers) {
        if (text.includes(tier)) { membership_tier = tier; break; }
      }

      if (loyalty_points !== null) break;
    }

    await browser.close();

    if (member_id) {
      await supabase.from("members").update({ loyalty_points, membership_tier, last_synced: new Date().toISOString() }).eq("id", member_id);
    }

    res.json({ success: true, loyalty_points, membership_tier });
  } catch (err) {
    if (browser) await browser.close().catch(() => {});
    console.error("[sync error]", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => console.log("API running on port 3001"));
