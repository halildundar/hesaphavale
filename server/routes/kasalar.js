import { CRUD, ObjectID } from "../db.js";
import { combineLatest, fromEvent, switchMap, of } from "rxjs";
import { HandlebarsScript, RxjsScript, XLSXScript } from "../genel/consts.js";
import { getDateRange } from "../genel/timeIslemler.js";
export const KasalarPage = (req, res) => {
  return res.render("pages/kasalar.hbs", {
    title: "Kasalar | Hesap Havale",
    scriptname: process.env.WEBSCRIPTNAME,
    scripts: HandlebarsScript + RxjsScript + XLSXScript,
    route: "/kasalar",
  });
};

export const GetKasalar = async (req, res) => {
  let db = CRUD("hesaphavale", "islemler");
  let rangeType = req.query.range || "yesterday";
  let endDate = req.query.isendtime;
  console.log(rangeType, endDate);
  if (!rangeType) return res.status(400).send("Missing range param");

  const range = getDateRange(rangeType, "Europe/Istanbul");
  let filter = {
    $gte: range.trStartNoOffset,
  };
  if (!!endDate) {
    filter["$lte"] = range.trEndNoOffset;
  }
  const datas = await db.collection
    .aggregate([
      {
        $match: {
          activityDateTime: filter,
        },
      },
      // Bankalar için grup
      {
        $group: {
          _id: { type: "Tedarikçi", name: "$accountBankName" },
          totalDeposit: { $sum: "$depositAmount" },
          totalWithdraw: { $sum: "$withdrawAmount" },
          totalNet: { $sum: "$netAmount" },
          totalFee: { $sum: "$feeAmount" },
          totalBalance: { $sum: "$balance" },
          feeRate: { $first: "$feeRate" },
          transactionCount: { $sum: 1 } 
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          type: "Tedarikçi",
          totalDeposit: 1,
          totalWithdraw: 1,
          totalNet: 1,
          totalFee: 1,
          totalBalance: 1,
          feeRate: 1,
          transactionCount:1
        },
      },
      {
        $unionWith: {
          coll: "islemler",
          pipeline: [
            { $match: { activityDateTime: filter } },
            {
              $group: {
                _id: { type: "Firma", name: "$branchName" },
                totalDeposit: { $sum: "$depositAmount" },
                totalWithdraw: { $sum: "$withdrawAmount" },
                totalNet: { $sum: "$netAmount" },
                totalFee: { $sum: "$feeAmount" },
                totalBalance: { $sum: "$balance" },
                feeRate: { $first: "$feeRate" },
                transactionCount: { $sum: 1 } 
              },
            },
            {
              $project: {
                _id: 0,
                name: "$_id.name",
                type: "Firma",
                totalDeposit: 1,
                totalWithdraw: 1,
                totalNet: 1,
                totalFee: 1,
                totalBalance: 1,
                feeRate: 1,
                transactionCount:1
              },
            },
          ],
        },
      },
    ])
    .toArray();
  return res.json(datas);
};
