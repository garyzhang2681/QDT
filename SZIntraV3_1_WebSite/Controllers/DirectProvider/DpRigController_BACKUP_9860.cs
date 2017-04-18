using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Dynamic;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.UI;
using Common.Utility.Direct;
using Common.Utility.Excel;
using Common.Utility.IO;
using Ext.Direct.Mvc;
using iTextSharp.text.html.simpleparser;
using NPOI.HSSF.UserModel;
using NPOI.SS.Formula.Functions;
using NPOI.SS.UserModel;
using Org.BouncyCastle.Bcpg;
using ProductionManagement.Models.EntityModel;
using SZIntraV3_1_WebSite.Models;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using Newtonsoft.Json.Linq;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;
using SZIntraV3_1_WebSite.Models.Rig;
using NPOI;
using NPOI.DDF;
using NPOI.HPSF;
using NPOI.HSSF;
using NPOI.POIFS;
using NPOI.SS;
using NPOI.Util;
using NPOI.Util.Collections;






namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{

    #region rig main menu

    public class DpRigController : QdtBaseController
    {

        private QDTEntities ent = new QDTEntities();



        [DirectInclude]
        public ActionResult GetRig()
        {

            int userId = GetCurrentUser().user_id;

            List<qdtGetRigList_Result> rig_list = ent.qdtGetRigList(userId).ToList();





            return this.Direct(new
            {
                success = true,
                data = rig_list,
                total = rig_list.Count



            });


        }


        [DirectInclude]
        public ActionResult GetRigByRigNum(JObject o)
        {

            var rignum = o["query"].Value<String>();

            List<qdt_rig> rig_num = (from a in ent.qdt_rig where a.rig_num.Contains(rignum) select a).ToList();

            return this.Direct(new
            {
                data = rig_num,
                total = rig_num.Count()

            });


        }


        [DirectInclude]
        public ActionResult SearchRIGs(JObject o)
        {
            var searchConditions = o["searchConditions"];

            Rig rigSearchResult = new Rig();



            rigSearchResult.rig_num = searchConditions["rig_num"].Value<string>();


            rigSearchResult.due_date_from = searchConditions["due_date_from"].Value<string>() == ""
                ? null
                : (DateTime?)Convert.ToDateTime(searchConditions["due_date_from"].Value<DateTime>().ToShortDateString());

            rigSearchResult.due_date_to = searchConditions["due_date_to"].Value<string>() == ""
                ? null
                : (DateTime?)Convert.ToDateTime(searchConditions["due_date_to"].Value<DateTime>().ToShortDateString()).AddDays(1);

            rigSearchResult.create_date_from = searchConditions["create_date_from"].Value<string>() == ""
                ? null
                : (DateTime?)Convert.ToDateTime(searchConditions["create_date_from"].Value<DateTime>().ToShortDateString()).AddDays(1);

            rigSearchResult.create_date_to = searchConditions["create_date_to"].Value<string>() == ""
                ? null
                 : (DateTime?)Convert.ToDateTime(searchConditions["create_date_to"].Value<DateTime>().ToShortDateString()).AddDays(1);

            rigSearchResult.create_by = searchConditions["create_by"].Value<string>() == ""
                ? null
                : (Int32?)searchConditions["create_by"].Value<Int32>();

            rigSearchResult.status = searchConditions["status"].Value<string>();
            rigSearchResult.dr_num = searchConditions["dr_num"].Value<string>();



            List<qdtSearchRig_Result> searchResult = new List<qdtSearchRig_Result>();


            searchResult = rigSearchResult.QueryRIG();

            return this.Direct(new
            {
                data = searchResult,
                total = searchResult.Count()

            });


        }






        [DirectInclude]
        public ActionResult QueryTrackNum(JObject o)
        {



            var trackNum = ent.qdtGetTrackNum(o["query"].Value<String>()).Distinct().ToList().AsQueryable();

            return this.Direct(new
            {
                data = PagedData(o, trackNum),
                total = trackNum.Count()
            });

        }
        [DirectInclude]
        public ActionResult GetGRNLine(string grn)
        {



            var grns = ent.qdtgetGRNLine(grn).ToList().Distinct();

            return DirectSuccess(grns);

        }

        [DirectInclude]
        public ActionResult GetGRNDetail(string trackNum)
        {


            var detail = ent.qdtRigGetDetail(trackNum).ToList().Distinct();

            return DirectSuccess(detail);

        }
        [DirectInclude]
        public ActionResult QueryLiabilitys()
        {



            var Liabilitys = ent.qdt_liability.ToList();

            return DirectSuccess(Liabilitys);

        }
        [DirectInclude]
        public ActionResult QueryGoods_returned_for()
        {



            var Goods_return_for = ent.qdt_goods_returned_for.ToList();

            return DirectSuccess(Goods_return_for);

        }
        [DirectInclude]
        public ActionResult GetSerLotByGRN(string grn, short grn_line)
        {



            var SerLotByGRN = ent.qdtRigGetSerLotByGRN(grn, grn_line).ToList();

            return DirectSuccess(SerLotByGRN);

        }



        [FormHandler]
        [DirectInclude]
        [ValidateInput(false)]
        public ActionResult CreateRIG()
        {


            try
            {



                string rignum = ent.qdtGenerateNumberSP("rig_num").Single();


                var form = Request.Form;




                string rigLine = Request.Params["rig_lines"];
                var rigLineLists = System.Web.Helpers.Json.Decode(rigLine);
                int rigCount = 0;





                foreach (var rigLineList in rigLineLists)
                {


                    qdt_rig rig = new qdt_rig()
                    {

                        rig_num = rignum,
                        rig_line = rigCount + 1,
                        vendor_num = rigLineList.vendor_num,
                        part_num = rigLineList.part_num,
                        liability = rigLineList.liability,
                        status = "Active",
                        create_date = DateTime.Now,
                        due_date = DateTime.Now.AddDays(45),
                        defect_desc = rigLineList.problem_description,
                        po_num = rigLineList.po_num,
                        dr_num = rigLineList.dr_num,
                        goods_returned_for = form["goods_returned_for"],
                        part_desc = rigLineList.part_desc,
                        drawing_num = rigLineList.drawing_num,
                        coc_num = rigLineList.coc_num,
                        grn_num = rigLineList.grn_num,
                        serial_lot = rigLineList.serial_lot,

                        po_line = rigLineList.po_line.ToString() == "" ? null : rigLineList.po_line,
                        goods_receive_date = rigLineList.received_date.ToString() == "" ? null : (DateTime?)Convert.ToDateTime(rigLineList.received_date),
                        grn_line = rigLineList.grn_line.ToString() == "" ? null : (Int32?)Int32.Parse(rigLineList.grn_line),

                        qty_received = rigLineList.qty_received.ToString() == "" ? null : (Int32?)Int32.Parse(rigLineList.qty_received),
                        qty_rejected = rigLineList.qty_rejected.ToString() == "" ? null : (Int32?)Int32.Parse(rigLineList.qty_rejected),

                        create_by = Int32.Parse(form["create_by"]),
                        quanlity_escape = rigLineList.quanlity_escape



                    };
                    ent.qdt_rig.AddObject(rig);

                    rigCount++;

                }

                if (rigCount == 0)
                {

                    return this.Direct(new
                    {
                        success = true,
                        errorMessage = "RIG 条目为空,无法生成！",
                        hasProblem = true
                    });
                }

                ent.SaveChanges();

                string fileLocation = "/qdtRigAttachments/";

                int attachmentCount = 1;
                foreach (string f in Request.Files)
                {
                    HttpPostedFileBase file = Request.Files[f];
                    if (file != null && file.ContentLength > 0)
                    {

                        string path = Server.MapPath(fileLocation);  //map to the server path

                        string fileName = rignum + "_" +
                                          file.FileName.Substring(file.FileName.LastIndexOf('\\') + 1, file.FileName.LastIndexOf('.') - file.FileName.LastIndexOf('\\') - 1) + "_" +
                                          DateTime.Now.Year + "_" +
                                          DateTime.Now.Month + "_" +
                                          DateTime.Now.Day + "_" +
                                          attachmentCount++ + "." +
                                          file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                        try
                        {
                            SystemAdminController.AddAttachment("rig", rignum, path + fileName, GetCurrentUser().user_id);
                            file.SaveAs(path + fileName);//保存文件
                        }
                        catch (Exception e)
                        {
                            throw e;
                        }
                    }
                    else
                    {
                        //文件为空的处理
                    }
                }


                return this.Direct(new
                {
                    success = true,
                    rig_num = rignum



                });

            }
            catch (Exception ex)
            {

                string err = ex.Message;
                return DirectFailure(err + "; Call Login CreateRIG failed!");
            }

        }




        [FormHandler]
        [DirectInclude]
        public ActionResult CloseRIG()
        {




            var form = Request.Form;
            int isClose = Int32.Parse(form["isClose"]);
            string rigNum = form["rig_num"];
            int rigLine = Int32.Parse(form["rig_line"]);
            switch (isClose)
            {
                case 0:


                    var rigresultUpdate = ent.qdt_rig.Single(n => n.rig_num == rigNum && n.rig_line == rigLine);

                    string isEscapeCn = form["quanlity_escape_cn"] ?? "";
                    string isEscapeEn = form["quanlity_escape_en"] ?? "";

                    int escapeTrans = (isEscapeCn.Equals("是") || isEscapeEn.Equals("True")) ? 1 : 0;

                    rigresultUpdate.due_date = Convert.ToDateTime(form["due_date"]);

                    rigresultUpdate.defect_desc = form["defect_desc"];

                    rigresultUpdate.liability = form["liability"];

                    rigresultUpdate.dr_num = form["dr_num"];

                    rigresultUpdate.serial_lot = form["serial_lot"];

                    rigresultUpdate.po_num = form["po_num"];



                    rigresultUpdate.coc_num = form["coc_num"];

                    rigresultUpdate.grn_num = form["grn_num"];



                    rigresultUpdate.part_desc = form["part_desc"];

                    rigresultUpdate.drawing_num = form["drawing_num"];

                    rigresultUpdate.goods_returned_for = form["goods_returned_for"];

                    rigresultUpdate.quanlity_escape = escapeTrans;

                    rigresultUpdate.goods_receive_date = form["goods_receive_date"] == "" ? null : (DateTime?)DateTime.Parse(form["goods_receive_date"]);

                    rigresultUpdate.qty_received = form["qty_received"] == "" ? null : (Int32?)Int32.Parse(form["qty_received"]);

                    rigresultUpdate.qty_rejected = form["qty_rejected"] == "" ? null : (Int32?)Int32.Parse(form["qty_rejected"]);
                    rigresultUpdate.po_line = form["po_line"] == "" ? null : (Int32?)Int32.Parse(form["po_line"]);
                    rigresultUpdate.grn_line = form["grn_line"] == "" ? null : (Int32?)Int32.Parse(form["grn_line"]);

                    ent.SaveChanges();
                    break;

                case 1:
                    var rigresult = ent.qdt_rig.Where(n => n.rig_num == rigNum);
                    foreach (var rigLines in rigresult)
                    {
                        rigLines.status = "Closed";
                    }
                    ent.SaveChanges();

                    string fileLocation = "/qdtRigAttachments/";

                    int attachmentCount = 1;
                    foreach (string f in Request.Files)
                    {
                        HttpPostedFileBase file = Request.Files[f];
                        if (file != null && file.ContentLength > 0)
                        {

                            string path = Server.MapPath(fileLocation);  //map to the server path

                            string fileName = rigNum + "_" +
                                              file.FileName.Substring(file.FileName.LastIndexOf('\\') + 1, file.FileName.LastIndexOf('.') - file.FileName.LastIndexOf('\\') - 1) + "_" +
                                              DateTime.Now.Year + "_" +
                                              DateTime.Now.Month + "_" +
                                              DateTime.Now.Day + "_" +
                                              attachmentCount++ + "." +
                                              file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                            try
                            {
                                SystemAdminController.AddAttachment("rig", rigNum, path + fileName, GetCurrentUser().user_id);
                                file.SaveAs(path + fileName);//保存文件
                            }
                            catch (Exception e)
                            {
                                throw e;
                            }
                        }
                        else
                        {
                            //文件为空的处理
                        }
                    }
                    break;
            }








            return DirectSuccess();



        }


        [DirectInclude]
        public ActionResult CheckRIGisclosed(string rignum)
        {

            string closeresult = ent.qdt_rig.First(n => n.rig_num == rignum).status;
            bool isclosed = closeresult == "Closed";

            return this.Direct(new
            {
                success = true,
                isclosed = isclosed

            });

        }


        public void PrintRig(string rignum)
        {
            var rigHead = ent.qdt_rig.First(n => n.rig_num == rignum);
            var rigDetail = ent.qdt_rig.Where(n => n.rig_num == rignum);

            var rigVendorManagement = ent.QDT_RIG_VendorManagement.ToArray();

            var vendorContact = ent.QDT_RIG_VendorManagement.Single(n => n.vend_num == rigHead.vendor_num);

            StringBuilder serLot = new StringBuilder();
            StringBuilder poNum = new StringBuilder();
            StringBuilder cOc = new StringBuilder();
            StringBuilder gRn = new StringBuilder();
            StringBuilder description = new StringBuilder();
            StringBuilder qtyRec = new StringBuilder();
            StringBuilder qtyRej = new StringBuilder();




            foreach (var rigLine in rigDetail)
            {
                serLot.Append(rigLine.serial_lot + "/");
                poNum.Append(rigLine.po_num + "/");
                cOc.Append(rigLine.coc_num + "/");
                gRn.Append(rigLine.grn_num + "/");


                description.Append(rigLine.serial_lot + "," + rigLine.defect_desc + "," + "\n");



                qtyRec.Append(rigLine.qty_received + "/");
                qtyRej.Append(rigLine.qty_rejected + "/");

            }




            string predixFilePath = System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "\\qdtRigAttachments\\RigFormat\\";
            string predixDownloadPath = System.AppDomain.CurrentDomain.SetupInformation.ApplicationBase + "\\qdtRigAttachments\\RigDownload\\";
            string fileName = rigHead.rig_num + ".xls";
            string fullPath = predixDownloadPath + fileName;
            string isQualityEscape = rigHead.quanlity_escape == 1 ? "Yes" : "No";

            FileStream fs = System.IO.File.OpenRead(predixFilePath + "RIG Report Format.xls");
            IWorkbook wk = new HSSFWorkbook(fs);
            fs.Close();

            ISheet sheet1 = wk.GetSheetAt(0);

            IRow row2 = sheet1.GetRow(1);
            IRow row4 = sheet1.GetRow(3);
            IRow row5 = sheet1.GetRow(4);
            IRow row6 = sheet1.GetRow(5);
            IRow row7 = sheet1.GetRow(6);
            IRow row8 = sheet1.GetRow(7);
            IRow row11 = sheet1.GetRow(10);
            IRow row13 = sheet1.GetRow(12);
            IRow row14 = sheet1.GetRow(13);



            ICell sn = row2.GetCell(8);
            sn.SetCellValue(rigHead.rig_num);
            sn.CellStyle.IsLocked = true;


            ICell supplier = row4.GetCell(0);
            supplier.SetCellValue("SUPPLIER: " + vendorContact.name);
            supplier.CellStyle.IsLocked = true;

            ICell address = row5.GetCell(0);
            address.SetCellValue(vendorContact.address);
            address.CellStyle.IsLocked = true;


            ICell contact = row7.GetCell(2);
            contact.SetCellValue(vendorContact.contact_name);
            contact.CellStyle.IsLocked = true;


            ICell eMail = row8.GetCell(0);
            eMail.SetCellValue(vendorContact.mail_address);
            eMail.CellStyle.IsLocked = true;

            ICell po = row4.GetCell(8);
            po.SetCellValue(poNum.ToString().Substring(0, poNum.ToString().Length - 1));
            po.CellStyle.IsLocked = true;

            ICell receiveDate = row6.GetCell(9);
            if (!(rigHead.goods_receive_date == null))
            {
                receiveDate.SetCellValue(Convert.ToDateTime(rigHead.goods_receive_date).ToShortDateString());
            }
            receiveDate.CellStyle.IsLocked = true;


            ICell coc = row7.GetCell(9);
            coc.SetCellValue(cOc.ToString().Substring(0, cOc.ToString().Length - 1));
            coc.CellStyle.IsLocked = true;

            ICell grn = row8.GetCell(7);
            grn.SetCellValue(gRn.ToString().Substring(0, gRn.ToString().Length - 1));
            grn.CellStyle.IsLocked = true;

            ICell pnDesc = row11.GetCell(0);
            pnDesc.SetCellValue(rigHead.part_desc);
            pnDesc.CellStyle.IsLocked = true;

            ICell partNum = row11.GetCell(3);
            partNum.SetCellValue(rigHead.part_num);
            partNum.CellStyle.IsLocked = true;

            ICell issue = row11.GetCell(5);
            issue.SetCellValue(rigHead.drawing_num);
            issue.CellStyle.IsLocked = true;

            ICell receiveQty = row11.GetCell(7);
            receiveQty.SetCellValue(qtyRec.ToString().Substring(0, qtyRec.ToString().Length - 1));
            receiveQty.CellStyle.IsLocked = true;

            ICell rejectQty = row11.GetCell(8);
            rejectQty.SetCellValue(qtyRej.ToString().Substring(0, qtyRej.ToString().Length - 1));
            rejectQty.CellStyle.IsLocked = true;

            ICell liability = row11.GetCell(9);
            liability.SetCellValue(rigHead.liability);
            liability.CellStyle.IsLocked = true;

            ICell qualityEscape = row11.GetCell(10);
            qualityEscape.SetCellValue(isQualityEscape);
            qualityEscape.CellStyle.IsLocked = true;

            ICell goodReturnFor = row11.GetCell(11);
            goodReturnFor.SetCellValue(rigHead.goods_returned_for);
            goodReturnFor.CellStyle.IsLocked = true;

            ICell dueDate = row13.GetCell(0);
            dueDate.SetCellValue("Due on " + Convert.ToDateTime(rigHead.due_date).ToShortDateString());
            dueDate.CellStyle.IsLocked = true;

            ICell createDate = row14.GetCell(0);
            createDate.SetCellValue("Raised on" + Convert.ToDateTime(rigHead.create_date).ToShortDateString());
            createDate.CellStyle.IsLocked = true;

            ICell defectDesc = row13.GetCell(4);
            defectDesc.SetCellValue(description.ToString());
            defectDesc.CellStyle.IsLocked = true;


            sheet1.ProtectSheet("SQE");




            FileStream wr = System.IO.File.Create(fullPath);

            wk.Write(wr);

            wr.Close();

            FileHandler.DownloadFile(fullPath, fileName, Response, true);

        }







        [DirectInclude]
        public ActionResult GetDrDescription(string drnum)
        {

            string result = "Job Order:" + (from a in ent.qdt_dr where a.dr_num == drnum select a.job).First() + "   " +
                            "DR Description:" +
                            (from a in ent.qdt_dr where a.dr_num == drnum select a.description).First() + "   " +
                            "DR Action Description:" +
                            (from a in ent.DR_ActionDesc where a.dr_num == drnum select a.totalActionDesc).First();





            return this.Direct(new
            {
                success = true,
                data = result

            });

        }


        [DirectInclude]
        public ActionResult GetRigGraphic()
        {

            List<qdtRigGetGraphic_Result> result = ent.qdtRigGetGraphic().ToList();

            return DirectSuccess(result);
        }








    #endregion


        #region vendor management

        [DirectInclude]
        public ActionResult GetVendorAll()
        {

            List<QDT_RIG_VendorManagement> result = ent.QDT_RIG_VendorManagement.Select(n => n).ToList();

            return this.Direct(new
            {
                success = true,
                data = result,
                total = result.Count
            });



        }

        [DirectInclude]
        public ActionResult GetVendorList(string name)
        {

            List<QDT_RIG_VendorManagement> result = ent.QDT_RIG_VendorManagement.Where(n => n.name == name).ToList();

            return this.Direct(new
            {
                success = true,
                data = result,
                total = result.Count
            });



        }
        [DirectInclude]
        public ActionResult GetVendorName(JObject o)
        {

            var q = o["query"];
            string vendorName = q.Value<String>();

            List<QDT_RIG_VendorManagement> result = ent.QDT_RIG_VendorManagement.Where(n => n.name.Contains(vendorName)).ToList();

            return this.Direct(new
            {
                success = true,
                data = result,
                total = result.Count
            });



        }

        [DirectInclude]
        public ActionResult GetVendorNum(JObject o)
        {

            var q = o["query"];
            string vendorNum = q.Value<String>();

            List<QDT_RIG_VendorManagement> result = ent.QDT_RIG_VendorManagement.Where(n => n.vend_num.Contains(vendorNum)).ToList();

            return this.Direct(new
            {
                success = true,
                data = result,
                total = result.Count
            });



        }




        [FormHandler]
        [DirectInclude]
        public ActionResult UpdateVendorInfor()
        {
            var form = Request.Form;
            string vend_num = form["vend_num"];
            var result = (from a in ent.qdt_rig_vendorList where a.vendor_num.Trim() == vend_num.Trim() select a);

            if (result.Any())
            {
                var reulstSingle = result.Single();

                reulstSingle.vendor_status = form["vendor_status"];
                reulstSingle.mail_address = form["mail_address"];
                reulstSingle.contact_name = form["contact_name"];
                reulstSingle.certification_status = form["certification_status"];
                reulstSingle.certification_expiry_date = form["certification_expiry_date"] == "" ? null : (DateTime?)DateTime.Parse(form["certification_expiry_date"]);
                reulstSingle.scope_of_service = form["scope_of_service"];
                reulstSingle.remark = form["remark"];


            }
            else
            {
                ent.AddToqdt_rig_vendorList(new qdt_rig_vendorList
                {
                    vendor_num = vend_num,
                    vendor_status = form["vendor_status"],
                    contact_name = form["contact_name"],
                    mail_address = form["mail_address"],
                    certification_status = form["certification_status"],
                    certification_expiry_date = form["certification_expiry_date"] == "" ? null : (DateTime?)DateTime.Parse(form["certification_expiry_date"]),
                    scope_of_service = form["scope_of_service"],
                    remark = form["remark"]

                });
            }

            ent.SaveChanges();





            return this.Direct(new
            {
                success = true

            });



        }

        [DirectInclude]
        public ActionResult SearchVendors(JObject o)
        {


            var searchConditions = o["searchConditions"];

            string vendorNum = searchConditions["vend_num"].Value<string>();

            string vendorName = searchConditions["name"].Value<string>();

            string vendorType = searchConditions["vendor_type"].Value<string>();

            List<QDT_RIG_VendorManagement> vendorList = ent.QDT_RIG_VendorManagement.Where(
                n => (n.vend_num.Trim() == vendorNum.Trim() || vendorNum == "") && (n.name == vendorName || vendorName == "") && (n.vendor_type == vendorType || vendorType == ""))
                .ToList();




            return this.Direct(new
            {
                success = true,
                data = vendorList,
                total = vendorList.Count()

            });
        }



        [DirectInclude]
        public ActionResult CheckSQE()
        {


            int userId = GetCurrentUser().user_id;

            Dictionary<string, int> SQE = new Dictionary<string, int>();

            SQE.Add("Liu Li", 398);
            SQE.Add("Ning Zhenping", 153);
            SQE.Add("Yu Yanxia", 320);
            SQE.Add("Zhang Hua", 543);
            SQE.Add("Jin Yifan", 50);
            SQE.Add("Liu Xiangli", 775);
<<<<<<< HEAD

=======
>>>>>>> 972b286e54a07598b02d566b16bf7230acd0c615



            if (SQE.ContainsValue(userId))
            {

                return DirectSuccess(1);
            }

            else
            {
                return DirectSuccess(0);
            }

        }





        #endregion




    }
}
