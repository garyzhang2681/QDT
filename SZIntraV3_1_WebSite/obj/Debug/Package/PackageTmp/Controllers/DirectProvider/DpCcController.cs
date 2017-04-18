using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.AccessControl;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using Newtonsoft.Json.Linq;
using NPOI.HSSF.UserModel;
using NPOI.HSSF.Util;
using NPOI.SS.Formula.Functions;
using NPOI.SS.UserModel;
using NPOI.SS.Util;
using SZIntraV3_1_WebSite.Models;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using Common.Utility.IO;
using SZIntraV3_1_WebSite.Models.System;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpCcController : QdtBaseController
    {
        [FormHandler]
        [DirectInclude]
        public ActionResult CreateCc()
        {
            var form = Request.Form;

            string ccNum = form["cc_num"];
            string business = form["business"];
            string department = form["department"];
            string partNum = form["part_num"];
            string serialLot = form["serial_lot"];
            string poNum = form["po_num"];
            bool repeat = form["repeat"].Equals("on") ? true : false;
            string criteria = form["criteria"];
            int type = Convert.ToInt32(form["type"]);
            int rejectedQuantity = Convert.ToInt32(form["rejected_quantity"]);
            string comments = form["comments"];
            int failureCode = Convert.ToInt32(form["failure_code"]);
            int? indicateFinding = form["indicate_finding"].Equals("") ? (int?)null : Convert.ToInt32(form["indicate_finding"]);
             DateTime? responseDate = form["response_date"].Equals("") ? (DateTime?)null :  DateTime.Parse(form["response_date"]);
            int qualityRep = Convert.ToInt32(form["quality_rep"]);
            string responsibleManager = form["responsible_manager"];
            int? caAssignedTo = form["ca_assigned_to"].Equals("") ? (int?)null : Convert.ToInt32(form["ca_assigned_to"]);
            DateTime? closedDate = form["closed_date"].Equals("") ? (DateTime?)null : DateTime.Parse(form["closed_date"]);
            string auditFindings = form["audit_findings"];

            DateTime now = DateTime.Now;

            using (QDTEntities db = new QDTEntities())
            {
                if (db.qdt_cc.Any(n => n.cc_num.Equals(ccNum)))
                {
                    return DirectFailure("该Customer Complaint ID已经存在，请重新刷新页面新建！");
                }
                else
                {
                    qdt_cc cc = new qdt_cc()
                    {
                        cc_num = ccNum,
                        business = business,
                        department = department,
                        part_num = partNum,
                        serial_lot = serialLot,
                        create_by = GetCurrentUser().user_id,
                        create_date = now,
                        po_num = poNum,
                        repeat = repeat,
                        criteria = criteria,
                        type = type,
                        rejected_quantity = rejectedQuantity,
                        comments = comments,
                        failure_code = failureCode,
                        indicate_finding = indicateFinding,
                        response_date = responseDate,
                        quality_rep = qualityRep,
                        responsible_manager = responsibleManager,
                        ca_assigned_to = caAssignedTo,
                        closed_date = closedDate,
                        audit_findings = auditFindings,
                        update_by = null,
                        update_date = null,
                        is_deleted = null,
                        deleted_by = null
                    };

                    db.qdt_cc.AddObject(cc);
                    db.SaveChanges();

                    //string path = ;
                    try
                    {
                        string path = Server.MapPath("/qdtCcAttachments/" + DateTime.Now.Year + "/" + cc.cc_num);

                        if (!Directory.Exists(path))
                        {
                            Directory.CreateDirectory(path);
                        }

                    }
                    catch (Exception e)
                    {
                        return DirectFailure(e);
                    }



                    return DirectSuccess();
                }
            }
        }

        [DirectInclude]
        public ActionResult DeleteCc(string ccNum)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var cc = db.qdt_cc.Single(n => n.cc_num.Equals(ccNum));
                cc.is_deleted = true;
                cc.deleted_by = GetCurrentUser().user_id;
                cc.delete_date = DateTime.Now;
                db.SaveChanges();
                return DirectSuccess();
            }
        }

        [FormHandler]
        [DirectInclude]
        public ActionResult UpdateCc()
        {
            var form = Request.Form;

            string ccNum = form["cc_num"];
            string bussiness = form["business"];
            string department = form["department"];
            string partNum = form["part_num"];
            string serialLot = form["serial_lot"];
            string poNum = form["po_num"];
            bool repeat = form["repeat"].Equals("on") ? true : false;
            string criteria = form["criteria"];
            int type = Convert.ToInt32(form["type"]);
            int rejectedQuantity = Convert.ToInt32(form["rejected_quantity"]);
            string comments = form["comments"];
            int failureCode = Convert.ToInt32(form["failure_code"]);
            int? indicateFinding = form["indicate_finding"].Equals("") ? (int?)null : Convert.ToInt32(form["indicate_finding"]);
            DateTime? responseDate = form["response_date"].Equals("") ? (DateTime?)null : DateTime.Parse(form["response_date"]);
            int qualityRep = Convert.ToInt32(form["quality_rep"]);
            string responsibleManager = form["responsible_manager"];
            int? caAssignedTo = form["ca_assigned_to"].Equals("") ? (int?)null : Convert.ToInt32(form["ca_assigned_to"]);
            DateTime? closedDate = form["closed_date"].Equals("") ? (DateTime?)null : DateTime.Parse(form["closed_date"]);
            string auditFindings = form["audit_findings"];

            DateTime now = DateTime.Now;

            using (QDTEntities db = new QDTEntities())
            {

                if (db.qdt_cc.Any(n => n.cc_num.Equals(ccNum)))
                {
                    var cc = db.qdt_cc.Single(n => n.cc_num.Equals(ccNum));
                    cc.business = bussiness;
                    cc.department = department;
                    cc.part_num = partNum;
                    cc.serial_lot = serialLot;
                    cc.po_num = poNum;
                    cc.repeat = repeat;
                    cc.criteria = criteria;
                    cc.type = type;
                    cc.rejected_quantity = rejectedQuantity;
                    cc.comments = comments;
                    cc.failure_code = failureCode;
                    cc.indicate_finding = indicateFinding;
                    cc.response_date = responseDate;
                    cc.quality_rep = qualityRep;
                    cc.responsible_manager = responsibleManager;
                    cc.ca_assigned_to = caAssignedTo;
                    cc.closed_date = closedDate;
                    cc.audit_findings = auditFindings;
                    cc.update_by = GetCurrentUser().user_id;
                    cc.update_date = now;
                    cc.is_deleted = null;
                    cc.deleted_by = null;

                    db.SaveChanges();
                    return DirectSuccess();
                }
                else
                {
                    return DirectFailure("该Customer Complaint ID不存在，请重新刷新页面新建！");
                }

            };

        }

        private List<qdt_cc> GetAllCcs()
        {
            using (QDTEntities db = new QDTEntities())
            {
                return db.qdt_cc.Where(n => n.is_deleted == null).ToList();
            }
        }

        [DirectInclude]
        public ActionResult GetCcs(JObject o)
        {

            var searchConditions = o["search_conditions"];
            var ccs = GetAllCcs();
            if (searchConditions == null)
            {
                return this.DirectSuccess(PagedData(o, ccs.AsQueryable()), ccs.Count());
            }

            string partNum = searchConditions["part_num"].Value<string>();
            string business = searchConditions["business"].Value<string>();
            int createBy = searchConditions["create_by"].Value<string>() != "" ? searchConditions["create_by"].Value<int>() : 0;

            string serialLot = searchConditions["serial_lot"].Value<string>();


            if (!business.Equals(""))
            {
                ccs = ccs.Where(n => n.business.Equals(business)).ToList();
            }

            if (!partNum.Equals(""))
            {
                ccs = ccs.Where(n => n.part_num.Equals(partNum)).ToList();
            }

            if (!serialLot.Equals(""))
            {
                ccs = ccs.Where(n => n.serial_lot.Equals(serialLot)).ToList();
            }

            if (createBy != 0)
            {
                ccs = ccs.Where(n => n.create_by == createBy).ToList();
            }

            return this.DirectSuccess(PagedData(o, ccs.AsQueryable()), ccs.Count());


        }


        [DirectInclude]
        public ActionResult GetCcIndicateFindings()
        {
            return this.DirectSuccess(QdtCommonString.GetCommonStringsByCategory1("cc_indicate_finding"));
        }

        [DirectInclude]
        public ActionResult GetCcFailureCodes()
        {
            return this.DirectSuccess(QdtCommonString.GetCommonStringsByCategory1("cc_failure_code"));
        }


        [DirectInclude]
        public ActionResult GetCcTypes()
        {
            return this.DirectSuccess(QdtCommonString.GetCommonStringsByCategory1("cc_type"));
        }

        [DirectInclude]
        public ActionResult GenerateCcNumber()
        {
            using (QDTEntities db = new QDTEntities())
            {
                var cc_num = db.qdt_num_gen.Single(n => n.name == "cc_num");
                var id = (cc_num.cur_id + 1);
                cc_num.cur_id = id;
                db.SaveChanges();
                return this.Direct(new
                {
                    cc_num = "C" + string.Format("{0:D4}", id) + "." + System.DateTime.Now.Year,
                    success = true
                });
            }
        }

        public void Print8DReport(string ccNum)
        {
            using (QDTEntities db = new QDTEntities())
            {

                if (db.qdt_cc.Any(n => n.cc_num.Equals(ccNum)))
                {
                    var cc = db.qdt_cc.Single(n => n.cc_num.Equals(ccNum));

                    string fileLocation = "/qdtCcPrints/";


                    //string path = @"\\TNWD07986\dr\";
                    string path = Server.MapPath(fileLocation);  //map to the server path

                    string temploateFileName = "Form F8520-002 8D Report Empty.xls";

                    string reportFileName = ccNum + "_" +
                                              DateTime.Now.Year + "_" +
                                              DateTime.Now.Month + "_" +
                                              DateTime.Now.Day + "_" +
                                              DateTime.Now.Hour + "_" +
                                              DateTime.Now.Minute + "_" +
                                              DateTime.Now.Second + ".xls";
                    string reportFilePath = path + reportFileName;

                    FileStream fs = System.IO.File.OpenRead(path + temploateFileName);

                    IWorkbook wk = new HSSFWorkbook(fs);
                    fs.Close();

                    ISheet sheet1 = wk.GetSheetAt(0);
                    IRow row3 = sheet1.GetRow(2);
                    IRow row4 = sheet1.GetRow(3);
                    IRow row5 = sheet1.GetRow(4);
                    IRow row8 = sheet1.GetRow(7);
                    IRow row7 = sheet1.GetRow(6);
                    IRow row10 = sheet1.GetRow(9);
                    IRow row36 = sheet1.GetRow(35);



                    ICell poNumCell = row3.GetCell(0);
                    poNumCell.SetCellValue(cc.po_num);
                    poNumCell.CellStyle.IsLocked = true;


                    ICell serialLotCell = row3.GetCell(3);
                    serialLotCell.SetCellValue(cc.serial_lot);
                    serialLotCell.CellStyle.IsLocked = true;

                    ICell workCenterCell = row3.GetCell(6);
                    workCenterCell.SetCellValue(cc.department);
                    workCenterCell.CellStyle.IsLocked = true;

                    ICell ccNumCell = row3.GetCell(9);
                    ccNumCell.SetCellValue(cc.cc_num);
                    ccNumCell.CellStyle.IsLocked = true;


                    poNumCell = row36.GetCell(0);
                    poNumCell.SetCellValue(cc.po_num);
                    poNumCell.CellStyle.IsLocked = true;


                    serialLotCell = row36.GetCell(3);
                    serialLotCell.SetCellValue(cc.serial_lot);
                    serialLotCell.CellStyle.IsLocked = true;

                    workCenterCell = row36.GetCell(6);
                    workCenterCell.SetCellValue(cc.department);
                    workCenterCell.CellStyle.IsLocked = true;

                    ccNumCell = row36.GetCell(9);
                    ccNumCell.SetCellValue(cc.cc_num);
                    ccNumCell.CellStyle.IsLocked = true;


                    ICell subjectCell = row4.GetCell(3);
                    subjectCell.SetCellValue(cc.part_num);
                    subjectCell.CellStyle.IsLocked = true;


                    ICell criteriaCell = row5.GetCell(3);
                    criteriaCell.SetCellValue(cc.criteria);
                    criteriaCell.CellStyle.IsLocked = true;

                    ICell createDateCell = row5.GetCell(9);
                    createDateCell.SetCellValue(cc.create_date.ToString());
                    createDateCell.CellStyle.IsLocked = true;


                    if (cc.ca_assigned_to != null)
                    {
                        ICell caAssignToCell = row7.GetCell(1);
                        caAssignToCell.SetCellValue(VmNativeUser.GetNativeUserByEmployeeId(cc.ca_assigned_to.Value).name_en);
                        caAssignToCell.CellStyle.IsLocked = true;
                    }


                    ICell responsibleManagerCell = row8.GetCell(1);
                    responsibleManagerCell.SetCellValue(cc.responsible_manager);
                    responsibleManagerCell.CellStyle.IsLocked = true;

                    ICell descriptionCell = row10.GetCell(4);
                    descriptionCell.SetCellValue(cc.comments);
                    descriptionCell.CellStyle.IsLocked = true;

                    sheet1.ProtectSheet("wisp");



                    FileStream wr = System.IO.File.Create(reportFilePath);

                    wk.Write(wr);

                    wr.Close();

                    FileHandler.DownloadFile(reportFilePath, reportFileName, Response, false);
                }
            }


        }
    }
}