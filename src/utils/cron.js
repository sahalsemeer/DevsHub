const cron = require("node-cron");
const ConnectionsRequests = require("../models/connectionRequests");
const { run } = require("./sendEmail");
const { startOfDay, endOfDay, subDays } = require("date-fns");

cron.schedule("0 8 * * *", async () => {
  try {
    const yesterday = subDays(Date.now(), 1);
    const startOfYesterday = startOfDay(yesterday);
    const endOfYesterday = endOfDay(yesterday);

    //yesterday's connection reqs
    const connectionRequests = await ConnectionsRequests.find({
      status: "interested",
      createdAt: {
        $gt: startOfYesterday,
        $lte: endOfYesterday,
      },
    }).populate("ToUserId");

    const emails = [
      ...new Set(connectionRequests.map((req) => req.ToUserId.emailId)),
    ];

    for (let email of emails) {
      try {
        console.log(email);
        const res = await run(
          `CONNECTION REQ SENT TO ${email}`,
          "You Have New Connection Requests!"
        );
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
});
