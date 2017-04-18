using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using Common.Utility.Direct;
using Ext.Direct.Mvc;
using NPOI.SS.Formula.Functions;
using SZIntraV3_1_WebSite.Models.EntityModel;
using Newtonsoft.Json.Linq;
using SZIntraV3_1_WebSite.Models;
using SZIntraV3_1_WebSite.Utility;
using System.Collections.Specialized;
using System.Text;
using System.Data.SqlClient;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using ProductionManagement.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;
using NPOI.HSSF.UserModel;
using NPOI.SS.UserModel;
using System.IO;




namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpIrdController : DirectMvcController
    {

        private QDTEntities qdtEntities = new QDTEntities();
        private SystemAdminEntities saEntities = new SystemAdminEntities();
        private PmbEntities pmbEntities = new PmbEntities();

        private string DEFAULT_LANG = "cn";
        /// <summary>
        /// Get current user
        /// </summary>
        /// <returns></returns>
        private User GetCurrentUser()
        {

            try
            {
                return (User)Session["user"];
            }
            catch
            {
                throw new TimeoutException();
            }
        }

        private string GetUserSSO()
        {
            return Request.Cookies["sso"].Value;
        }



        /// <summary>
        /// Get user language setting
        /// TODO: store 'lang' in session or user model
        /// </summary>
        /// <returns></returns>
        private string GetLang()
        {
            var lang = string.Empty;
            var user = GetCurrentUser();

            //Cookie 'lang' may be different with Session 'user->lang' while user is switching language
            if (Request.Cookies["lang"] != null)
            {
                var cookieLang = Request.Cookies["lang"].Value;
                if (user != null && user.lang != cookieLang)
                {
                    user.lang = cookieLang;
                }
                lang = cookieLang;
            }
            else
            {
                lang = DEFAULT_LANG;
            }
            return lang;
        }




        [DirectInclude]
        public ActionResult GetUserInfoBySSO(string sso)
        {
            try
            {
                if (sso.Trim().Equals(""))
                {
                    return this.DirectFailure("请输入您的SSO");
                }
                var user = saEntities.sys_user.Where(n => n.sso == sso).ToList();
                if (user.Count == 0)
                {
                    return this.DirectFailure("There is no User with SSO " + sso);
                }
                else
                {
                    return this.DirectSuccess(user.Single());
                }
            }
            catch
            {
                return this.DirectFailure("Call Login GetUserInfoBySSO Failed!");
            }
        }

        [DirectInclude]
        public ActionResult GetIrdRouteList(JObject o)
        {
            try
            {
                List<qdtGetIrdRouteListSP_Result> irds = qdtEntities.qdtGetIrdRouteListSP().ToList();
                return this.DirectSuccess(PagedData(o, irds.AsQueryable()).ToList(), irds.Count);
                //List<qdtGetIrdRouteListSP_Result> temp = new List<qdtGetIrdRouteListSP_Result>();
                //foreach (qdtGetIrdRouteListSP_Result ird in PagedData(o, irds.AsQueryable()))
                //{
                //    temp.Add(ird);
                //}
                //return this.Direct(
                //    new
                //    {
                //        data = temp,
                //        total = temp.Count,
                //        DirectSuccess = true
                //    });
            }
            catch
            {
                return this.DirectFailure("Call Login GetIrdRouteList Failed");
            }
        }


        [DirectInclude]
        public ActionResult GetIrdHeaderInformationBySerialNumber(string serial)
        {
            try
            {
                string s = serial.ToString().Trim();
                var irdHeaderInformation = qdtEntities.qdtGetIrdHeaderInformationBySerialNumberSP(s).Single();


                //var irdHeaderInformation = qdtEntities.qdtGetIrdHeaderInformationBySerialNumberSP(serial).Single();


                int? ird_id = pmbEntities.sl_item.Single(n => n.item == irdHeaderInformation.part_num).ird_id;
                var qdtIrdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == ird_id);
                irdHeaderInformation.rev_level = qdtIrdRevision.rev_level;
                irdHeaderInformation.ird_revision = qdtIrdRevision.revision;
                return this.DirectSuccess(irdHeaderInformation);
            }
            catch
            {
                return this.DirectFailure("Call Login GetIrdHeaderInformationBySerialNumber Failed");
            }
        }



        [DirectInclude]
        public ActionResult GetIrdBomHeaderInformationBySerialNumber(string serial)
        {
            try
            {
                var irdHeaderInformation = qdtEntities.qdtGetIrdHeaderInformationBySerialNumberSP(serial).Single();
                return this.DirectSuccess(irdHeaderInformation);
            }
            catch
            {
                return this.DirectFailure("Call Login GetIrdBomHeaderInformationBySerialNumber Failed");
            }
        }



        [DirectInclude]
        [FormHandler]
        public ActionResult GenerateIrd()
        {
            try
            {

                using (QDTEntities qdtdb = new QDTEntities())
                using (PmbEntities pmbdb = new PmbEntities())
                {
                    var form = Request.Form;
                    string serial = form["serial"].ToString().Trim();
                    string partNum = form["part_num"];
                    string job = form["job"];
                    short? suffix = Convert.ToInt16(form["suffix"]);
                    int? irdId = pmbdb.sl_item.Single(n => n.item == partNum).ird_id;

                    // var qdtIrdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == irdId);

                    var qdtIrdCharacteristics = qdtdb.qdt_ird_characteristic.Where(n => n.ird_id == irdId && n.revision_type.Equals("formal"));

                    var qdtIrdRouteCount = qdtdb.qdt_ird_route.Count(n => n.job == job && n.suffix == suffix);
                    if (qdtIrdRouteCount > 0)
                    {
                        return this.DirectFailure("IRD for this job and suffix already exists!");
                    }


                    foreach (qdt_ird_characteristic qdtIrdCharacteristic in qdtIrdCharacteristics)
                    {
                        qdt_ird_route irdroute = new qdt_ird_route
                        {
                            serial = serial,
                            job = job,
                            suffix = suffix, //todo
                            item = partNum,
                            oper_num = qdtIrdCharacteristic.oper_num,
                            char_seq = qdtIrdCharacteristic.char_seq,
                            char_num = qdtIrdCharacteristic.char_num,
                            char_type = qdtIrdCharacteristic.char_type,
                            blue_print_zone = qdtIrdCharacteristic.blue_print_zone,
                            basic_gage_id = qdtIrdCharacteristic.basic_gage_id,
                            fml_gage_id = qdtIrdCharacteristic.fml_gage_id,
                            char_description = qdtIrdCharacteristic.char_description,
                            characteristic = qdtIrdCharacteristic.characteristic,
                            basic_rec_type = qdtIrdCharacteristic.basic_rec_type,
                            fml_rec_type = qdtIrdCharacteristic.fml_rec_type,
                            char_maximum = qdtIrdCharacteristic.char_maximum,
                            char_minimum = qdtIrdCharacteristic.char_minimum,
                            gdnt_link = qdtIrdCharacteristic.gdnt_link,
                            oai_flag = qdtIrdCharacteristic.oai_flag,
                            oap_flag = qdtIrdCharacteristic.oap_flag,
                            is_cmm_flag = qdtIrdCharacteristic.is_cmm_flag,
                            need_cmm = qdtIrdCharacteristic.need_cmm,
                            line_qty = qdtIrdCharacteristic.line_qty,
                            fml_mark = null,
                            create_date = System.DateTime.Now,
                            create_by = this.GetCurrentUser().user_id,
                            ird_id = irdId,
                            cpk = qdtIrdCharacteristic.cpk,
                            spc_control = qdtIrdCharacteristic.spc_control,
                            spc_result = null,
                            char_id = qdtIrdCharacteristic.char_id

                        };

                        qdtdb.qdt_ird_route.AddObject(irdroute);

                    }

                    qdtdb.SaveChanges();
                }

                return DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login GenerateIrd Failed!");
            }
        }

        [DirectInclude]
        public ActionResult UpdateFmlMark(string serial, int operationNumber, string fmlMark)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    var routes = db.qdt_ird_route.Where(n => n.serial.Equals(serial) && n.oper_num == operationNumber).ToList();
                    foreach (var route in routes)
                    {
                        route.fml_mark = fmlMark;
                        if (!fmlMark.Equals("others"))
                        {
                            route.spc_result = null;
                        }
                        else
                        {
                            var charId = route.char_id;
                            var spcResult = db.qdt_ird_characteristic.Single(n => n.char_id == charId).spc_result;
                            route.spc_result = spcResult;
                                //qdt_ird_characteristic中的spc_result值，这么做是因为有可能员工先设成fml然后改成others
                        }
                    }
                    db.SaveChanges();
                }

                //if (!fml_mark.Equals("others"))
                //{
                //    qdtEntities.ExecuteStoreCommand(
                //        "update qdt_ird_route set fml_mark=@fml_mark,spc_result=@spcResult where serial = @serial and oper_num=@oper_num",
                //        new SqlParameter("@fml_mark", fml_mark), new SqlParameter("@spcResult", null),
                //        new SqlParameter("@serial", serial.ToString().Trim()),
                //        new SqlParameter("@oper_num", operationNumber));
                //}
                //else
                //{
                //    qdtEntities.ExecuteStoreCommand("update qdt_ird_route set fml_mark=@fml_mark where serial = @serial and oper_num=@oper_num",
                //   new SqlParameter("@fml_mark", fml_mark), new SqlParameter("@serial", serial.ToString().Trim()), new SqlParameter("@oper_num", operationNumber));
                //}
                return DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login UpdateFmlMark Failed!");
            }
        }


        [DirectInclude]
        public ActionResult GetBOMCharacteristicsByIrdIdOperationNumber(JObject o)
        {
            string revisionType = "draft";
            try
            {
                int irdId = o["ird_id"].Value<int>();
                int operNum = o["oper_num"].Value<int>();
                //  bool isUpgrade = o["isUpgrade"].Value<bool>();
                List<qdt_ird_characteristic> characteristics = qdtEntities.qdt_ird_characteristic.Where(n => n.ird_id == irdId && n.oper_num == operNum && n.revision_type == revisionType).OrderBy(n => n.char_seq).ToList();

                List<QdtIrdCharacteristic> qdtCharacterstics = new List<QdtIrdCharacteristic>();
                foreach (qdt_ird_characteristic characteristic in characteristics)
                {
                    QdtIrdCharacteristic qdtCharacterstic = new QdtIrdCharacteristic(characteristic);
                    qdtCharacterstic.InitialProperties();
                    qdtCharacterstics.Add(qdtCharacterstic);
                }
                return this.DirectSuccess(PagedData(o, qdtCharacterstics.AsQueryable()));
            }
            catch
            {
                return this.DirectFailure("Error: Call Login GetBOMCharacteristicsByIrdIdOperationNumber Failure");
            }
        }


        [DirectInclude]
        public ActionResult GetOperationsByItem(string partNumber)
        {
            try
            {
                List<qdtGetOperationsByPartNumberSP_Result> operations = qdtEntities.qdtGetOperationsByPartNumberSP(partNumber).ToList();
                return this.DirectSuccess(operations.AsQueryable());
            }
            catch
            {
                return this.DirectFailure("Call Login GetOperationsByItem Failed!");
            }

        }


        //[DirectInclude]
        //public ActionResult GetOperationsBySerialNumber(string serial)
        //{
        //    try
        //    {

        //        var operations = qdtEntities.qdtGetOperationsBySerialNumberSP(serial.ToString().Trim()).ToList();
        //        return this.DirectSuccess(operations.AsQueryable());
        //    }
        //    catch
        //    {
        //        return this.DirectFailure("Call Login GetOperationsBySerialNumber Failed!");
        //    }

        //}

        [DirectInclude]
        public ActionResult GetOperationsBySerialNumber(string serial)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {

                    //var data = (from route in db.qdt_ird_route
                    //            where route.serial == serial
                    //            group route by new { oper_num = route.oper_num, fml_mark = route.fml_mark } into temp
                    //            orderby temp.Key.oper_num ascending
                    //            select new
                    //            {
                    //                id = temp.Key.oper_num,
                    //                oper_num = temp.Key.oper_num,
                    //                fml_mark = temp.Key.fml_mark,
                    //                char_count = temp.Count(),
                    //                leaf = true
                    //            }).ToList();

                    var data = db.qdtGetOperationsBySerialNumberSP(serial).Select(n => new
                    {
                        id = n.oper_num.ToString() + n.is_cmm_flag.ToString(),
                        oper_num = n.oper_num,
                        fml_mark = n.fml_mark,
                        is_cmm_flag = n.is_cmm_flag,
                        oper_char_count = n.oper_char_count,
                        oper_trans_count = n.oper_trans_count,
                        insp_char_count = n.insp_char_count,
                        insp_trans_count = n.insp_trans_count,
                        leaf = true
                    }).ToList();


                    return this.DirectSuccess(data);
                }
            }
            catch
            {
                return this.DirectFailure("Call Login GetOperationsBySerialNumber Failed!");
            }

        }


        [DirectInclude]
        public ActionResult GetCharacteristicsStatisticsBySerialAndOperationNumber(string serial, int previousOperationNumber)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    var result = db.qdtGetCharacteristicsStatisticsBySerialAndOperationNumberSP(serial, previousOperationNumber).ToList();
                    return this.DirectSuccess(result);
                }
            }
            catch
            {
                return this.DirectFailure("Call method DpIrdController GetCharacteristicsStatisticsBySerialAndOperationNumber Failed!");
            }
        }

        [DirectInclude]
        public ActionResult GetCMMCharacteristicsStatisticsBySerialAndOperationNumber(string serial, int previousOperationNumber, int operationNumber)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    //string s = serial.ToString().Trim();
                    //var irdHeaderInformation = qdtEntities.qdtGetIrdHeaderInformationBySerialNumberSP(s).Single();
                    //int? ird_id = pmbEntities.sl_item.Single(n => n.item == irdHeaderInformation.part_num).ird_id;

                    //IEnumerable<int?> cmm_checkpoints = db.qdt_ird_cmm_checkpoint.Where(n => n.ird_id == ird_id).Select(n => n.oper_num).ToArray();

                    if (IsCheckPoint(serial, operationNumber))
                    {
                        var result = db.qdtGetCMMCharacteristicsStatisticsBySerialAndOperationNumberSP(serial, previousOperationNumber).First();

                        return this.Direct(new
                        {
                            success = true,
                            data = result,
                            isCheckpoint = true
                        });
                    }
                    else
                    {
                        return this.Direct(new
                        {
                            success = true,
                            isCheckpoint = false
                        });
                    }
                }
            }
            catch
            {
                return this.DirectFailure("Call method DpIrdController GetCMMCharacteristicsStatisticsBySerialAndOperationNumber Failed!");
            }
        }

        [DirectInclude]
        public ActionResult CheckCheckPoint(string serial, int previousOperationNumber, int operationNumber)
        {

            using (QDTEntities db = new QDTEntities())
            {
                var data = db.qdtGetOperationsBySerialNumberSP(serial).Select(n => new
                {
                    id = n.oper_num.ToString() + n.is_cmm_flag.ToString(),
                    oper_num = n.oper_num,
                    fml_mark = n.fml_mark,
                    is_cmm_flag = n.is_cmm_flag,
                    oper_char_count = n.oper_char_count,
                    oper_trans_count = n.oper_trans_count,
                    insp_char_count = n.insp_char_count,
                    insp_trans_count = n.insp_trans_count,
                    leaf = true
                }).Where(n => n.oper_num < operationNumber).ToList();

                bool previousInspectionAllFinished = true;
                foreach (var d in data)
                {
                    if (d.fml_mark.Equals("others"))
                    {
                        if (d.oper_char_count != d.oper_trans_count)
                        {
                            previousInspectionAllFinished = false;
                        }
                    }
                    else
                    {
                        if (d.oper_char_count != d.oper_trans_count || d.insp_char_count != d.insp_trans_count)
                        {
                            previousInspectionAllFinished = false;
                        }
                    }
                }

                return this.Direct(new
                {
                    success = true,
                    isCheckpoint = IsCheckPoint(serial, operationNumber),
                    previousInspectionFinished = previousInspectionAllFinished
                });
            }
        }




        private bool IsCheckPoint(string serial, int operationNumber)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    string s = serial.ToString().Trim();
                    var irdHeaderInformation = qdtEntities.qdtGetIrdHeaderInformationBySerialNumberSP(s).Single();
                    int? ird_id = pmbEntities.sl_item.Single(n => n.item == irdHeaderInformation.part_num).ird_id;

                    IEnumerable<int?> cmm_checkpoints = db.qdt_ird_cmm_checkpoint.Where(n => n.ird_id == ird_id).Select(n => n.oper_num).ToArray();

                    if (cmm_checkpoints.Contains(operationNumber))
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
                }
            }
            catch
            {
                return true;
            }
        }


        [DirectInclude]
        public ActionResult GetCurrentRevisionByItem(string partNumber)
        {
            try
            {
                List<qdtGetOperationsByPartNumberSP_Result> operations = qdtEntities.qdtGetOperationsByPartNumberSP(partNumber).ToList();


                //  item 中没有operation
                if (operations[0].oper_num == null)
                {
                    return this.Direct(new
                    {
                        noOperation = true,
                        noIrdId = true,
                        noNormalIrdId = true,
                        operations = operations,
                        user = GetCurrentUser().user_id,
                        success = true
                    });
                }

                var item = pmbEntities.sl_item.Single(n => n.item == partNumber);
                QdtIrdRevision irdRevision = new QdtIrdRevision();
                //item 中有operation, 没有ird_revision 信息，并且没有编辑过任何的draft
                if (item.ird_id == null)
                {
                    var maxIrdId = qdtEntities.qdt_ird_revision.Max(n => n.ird_id);
                    return this.Direct(new
                    {
                        noOperation = false,
                        noIrdId = true,
                        maxIrdId = maxIrdId,
                        noNormalIrdId = true,
                        operations = operations,
                        user = GetCurrentUser().user_id,
                        success = true
                    });


                    //else if (true)//item 中有operation, 没有ird_revision信息，有编辑过的draft，或者prepared的或者approved，但是没verified的
                    //{

                    //}

                }
                else if (qdtEntities.qdt_ird_characteristic.Count(n => n.ird_id == item.ird_id && n.revision_type.Equals("formal")) == 0)
                {
                    irdRevision = new QdtIrdRevision(qdtEntities.qdt_ird_revision.Where(n => n.ird_id == item.ird_id).Single());
                    return this.Direct(new
                    {
                        noOperation = false,
                        noIrdId = false,
                        noNormalIrdId = true,
                        irdRevision = irdRevision,
                        operations = operations,
                        user = GetCurrentUser().user_id,
                        success = true
                    });
                }


                //item 中有operation，并且item中ird_id 为可以正式用的ird_id
                try
                {
                    irdRevision = new QdtIrdRevision(qdtEntities.qdt_ird_revision.Where(n => n.ird_id == item.ird_id).Single());
                }
                catch
                {
                    return this.DirectFailure("Call Login GetCurrentRevisionByItem Failure -> Get IRD Revision information Error!");
                }


                QdtIrdRevision newIrdRevision = new QdtIrdRevision();
                try
                {
                    string sPrepared = QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Prepared];
                    string sVerified = QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Verified];

                    var newIrdRevisionId = qdtEntities.qdt_ird_revision.Where(n => n.item == partNumber && (n.status == sPrepared || n.status == sVerified)).Max(n => n.ird_id);

                    newIrdRevision = new QdtIrdRevision(qdtEntities.qdt_ird_revision.Single(n => n.ird_id == newIrdRevisionId));
                }
                catch
                {
                    newIrdRevision = null;
                }

                return this.Direct(new
                {
                    operations = operations,
                    irdRevision = irdRevision,
                    newIrdRevision = newIrdRevision,
                    user = GetCurrentUser().user_id,
                    success = true
                });
            }
            catch
            {
                return this.DirectFailure("Call Login GetCurrentRevisionByItem Failed!");
            }
        }

        [DirectInclude]
        public ActionResult GetGageList(JObject o)
        {
            string query = o["query"].Value<String>().ToUpper();
            List<qdt_ird_gage> irdGages = qdtEntities.qdt_ird_gage.Where(n => n.gage_description_en.ToUpper().Contains(query)
                                                            || n.gage_description_cn.ToUpper().Contains(query)).ToList();
            List<QdtIrdGage> gages = new List<QdtIrdGage>();

            foreach (qdt_ird_gage gage in irdGages)
            {
                QdtIrdGage g = new QdtIrdGage(gage);
                gages.Add(g);
            }
            return this.Direct(new
            {
                data = PagedData(o, gages.AsQueryable()),
                success = true,
                total = gages.Count()

            });
        }


        [FormHandler]
        [DirectInclude, ValidateInput(false)]
        public ActionResult UpdateCharacteristic()
        {

            var form = Request.Form;
            string revisionType = "draft";

            int charId = Convert.ToInt32(form["ird_characteristic.char_id"]);

            qdt_ird_characteristic ird_characteristic = new qdt_ird_characteristic();
            try
            {
                ird_characteristic = qdtEntities.qdt_ird_characteristic.Single(n =>
                    n.char_id == charId);
                ird_characteristic.char_seq = Convert.ToInt32(form["ird_characteristic.char_seq"]);
                ird_characteristic.char_num = form["ird_characteristic.char_num"].Equals("") ? null : form["ird_characteristic.char_num"];
                ird_characteristic.char_type = form["ird_characteristic.char_type"];
                ird_characteristic.blue_print_zone = form["ird_characteristic.blue_print_zone"];
                ird_characteristic.basic_gage_id = Convert.ToInt32(form["basic_gage"]);
                ird_characteristic.fml_gage_id = Convert.ToInt32(form["fml_gage"]);
                ird_characteristic.char_description = form["ird_characteristic.char_description"];
                ird_characteristic.characteristic = form["ird_characteristic.char"];
                ird_characteristic.basic_rec_type = form["basic_rec_type"];
                ird_characteristic.fml_rec_type = form["fml_rec_type"];
                //   ird_characteristic.char_maximum =  form["ird_characteristic.char_maximum"].Equals("") ? null : Convert.ToDecimal(form["ird_characteristic.char_maximum"]);
                //  ird_characteristic.char_minimum = Convert.ToDecimal(form["ird_characteristic.char_minimum"]);
                ird_characteristic.gdnt_link = form["gdnt_link"];
                ird_characteristic.oai_flag = form["ird_characteristic.oai_flag"] == "true" ? true : false;
                ird_characteristic.oap_flag = form["ird_characteristic.oap_flag"] == "true" ? true : false;
                ird_characteristic.is_cmm_flag = form["ird_characteristic.is_cmm_flag"] == "true" ? true : false;
                ird_characteristic.need_cmm = form["ird_characteristic.need_cmm"] == "true" ? true : false;
                ird_characteristic.line_qty = Convert.ToInt32(form["ird_characteristic.line_qty"]);
                ird_characteristic.status = ird_characteristic.status == "added" ? "added" : "updated";
                ird_characteristic.revision_type = revisionType;

                if (form["ird_characteristic.char_maximum"] != null && !form["ird_characteristic.char_maximum"].Equals(""))
                {
                    ird_characteristic.char_maximum = Convert.ToDecimal(form["ird_characteristic.char_maximum"]);
                }
                if (form["ird_characteristic.char_minimum"] != null && !form["ird_characteristic.char_minimum"].Equals(""))
                {
                    ird_characteristic.char_minimum = Convert.ToDecimal(form["ird_characteristic.char_minimum"]);
                }

                qdtEntities.SaveChanges();
            }
            catch
            {
                return this.DirectFailure("Call method UpdateCharacteristic Failure");
            }

            //MarkingEditIrdRevision(Convert.ToInt32(form["ird_characteristic.ird_id"]));

            return this.Direct(new
            {
                success = true,
                ird_characteristic = ird_characteristic,
            });
        }



        [DirectInclude]
        public ActionResult CreateIrdRevision(string partNum)
        {
            try
            {
                var maxIrdId = qdtEntities.qdt_ird_revision.Max(n => n.ird_id);
                var item = pmbEntities.sl_item.Single(n => n.item == partNum);
                item.ird_id = maxIrdId + 1;
                pmbEntities.SaveChanges();


                //TODO,要在ird_revision表中添加信息 状态为unprepared
                //TODO，在用户点击upgrade ird按钮的时候，就要创建对应的ird_revision项， 在用户放弃draft的时候也要删除对应的


                return this.Direct(
                    new
                    {
                        success = true,
                        maxIrdId = maxIrdId + 1
                    }
                    );
            }
            catch
            {
                return this.DirectFailure("Call Login CreateIrdRevision Failed!");
            }

        }

        [FormHandler]
        [DirectInclude, ValidateInput(false)]
        public ActionResult CreateCharacteristic()
        {
            try
            {

                NameValueCollection form = Request.Form;

                if (CanEdit(Convert.ToInt32(form["ird_characteristic.ird_id"]), GetCurrentUser().user_id))
                {
                    string revisionType = "draft";

                    int operNum = Convert.ToInt32(form["ird_characteristic.oper_num"]);
                    int charSeq = Convert.ToInt32(form["ird_characteristic.char_seq"]);
                    int irdId = Convert.ToInt32(form["ird_characteristic.ird_id"]);


                    var followingCharacteristics = qdtEntities.qdt_ird_characteristic.Where(n => n.revision_type.Equals("draft") && n.ird_id == irdId && n.oper_num == operNum && n.char_seq >= charSeq).ToList();

                    foreach (var followingCharacteristic in followingCharacteristics)
                    {
                        followingCharacteristic.char_seq = followingCharacteristic.char_seq + 1;
                        qdtEntities.SaveChanges();
                    }



                    qdt_ird_characteristic irdCharacteristic = new qdt_ird_characteristic()
                    {
                        ird_id = irdId,
                        oper_num = operNum,

                        char_seq = charSeq,
                        char_num = form["ird_characteristic.char_num"],
                        char_type = form["ird_characteristic.char_type"],
                        blue_print_zone = form["ird_characteristic.blue_print_zone"],
                        basic_gage_id = Convert.ToInt32(form["basic_gage"]),
                        fml_gage_id = Convert.ToInt32(form["fml_gage"]),
                        char_description = form["ird_characteristic.char_description"],
                        characteristic = form["ird_characteristic.char"],
                        basic_rec_type = form["basic_rec_type"],
                        fml_rec_type = form["fml_rec_type"],
                        //char_maximum = Convert.ToDecimal(form["ird_characteristic.char_maximum"]),
                        //char_minimum = Convert.ToDecimal(form["ird_characteristic.char_minimum"]),
                        gdnt_link = form["gdnt_link"],
                        oai_flag = form["ird_characteristic.oai_flag"] == "1" ? true : false,
                        oap_flag = form["ird_characteristic.oap_flag"] == "1" ? true : false,
                        is_cmm_flag = form["ird_characteristic.is_cmm_flag"] == "1" ? true : false,
                        need_cmm = form["ird_characteristic.need_cmm"] == "1" ? true : false,
                        line_qty = Convert.ToInt32(form["ird_characteristic.line_qty"]),
                        status = "added",
                        revision_type = revisionType
                    };

                    if (form["ird_characteristic.char_maximum"] != null && !form["ird_characteristic.char_maximum"].Equals(""))
                    {
                        irdCharacteristic.char_maximum = Convert.ToDecimal(form["ird_characteristic.char_maximum"]);
                    }
                    if (form["ird_characteristic.char_minimum"] != null && !form["ird_characteristic.char_minimum"].Equals(""))
                    {
                        irdCharacteristic.char_minimum = Convert.ToDecimal(form["ird_characteristic.char_minimum"]);
                    }

                    qdtEntities.qdt_ird_characteristic.AddObject(irdCharacteristic);
                    qdtEntities.SaveChanges();


                    //update seq of the chars under the op


                    return this.Direct(new
                    {
                        success = true,
                        ird_characteristic = irdCharacteristic,
                    });
                }
                else
                {
                    return this.DirectFailure("Someone is Editing this IRD BOM, Please contact IT!");
                }
            }
            catch
            {
                return this.DirectFailure("Call DpIrdController CreateCharacteristic Failure");
            }
        }

        [DirectInclude]
        public ActionResult GetCharacteristicsByPartNumber(string partNumber)
        {
            try
            {
                var irdCharacteristics = qdtEntities.qdtGetCharacteristicsByPartNumberSP(partNumber);

                List<QdtIrdCharacteristic> characteristics = new List<QdtIrdCharacteristic>();
                foreach (qdt_ird_characteristic irdCharacteristic in irdCharacteristics)
                {
                    QdtIrdCharacteristic c = new QdtIrdCharacteristic(irdCharacteristic);
                    c.InitialProperties();
                    characteristics.Add(c);
                }
                return this.DirectSuccess(characteristics);
            }
            catch
            {
                return this.DirectFailure("Call Login GetCharacteristicsByPartNumber Failure!");
            }
        }

        [DirectInclude]
        public ActionResult GetRoutesAndTransactionsBySerialNumberAndOperationNumber(string serial, int operationNumber, bool isCmmFlag)
        {
            try
            {
                var records = qdtEntities.qdtGetRoutesAndTransactionsBySerialNumberAndOperationNumberSP(serial.ToString().Trim(), operationNumber).ToList();
                bool hasTransaction = (records.Count(n => n.operator_trans_num != null || n.inspector_trans_num != null) > 0) ? true : false;
                return this.Direct(new
                {
                    success = true,
                    hasTransaction = hasTransaction,
                    data = records.Where(n => n.is_cmm_flag == isCmmFlag)
                });
            }
            catch
            {
                return this.DirectFailure("Call Login GetRoutesAndTransactionsBySerialNumberAndOperationNumber Failed!");
            }
        }


        [Obsolete]
        [DirectInclude]
        public ActionResult GetRoutesBySerialNumberAndOperationNumber(string serial, int operationNumber)
        {
            try
            {
                string s = serial.ToString().Trim();
                var qdtIrdRoutes = qdtEntities.qdt_ird_route.Where(n => n.serial == s && n.oper_num == operationNumber);


                List<QdtIrdRoute> routes = new List<QdtIrdRoute>();
                List<QdtIrdTransaction> transactions = new List<QdtIrdTransaction>();
                foreach (qdt_ird_route qdtIrdRoute in qdtIrdRoutes)
                {
                    QdtIrdRoute r = new QdtIrdRoute(qdtIrdRoute);
                    r.InitialProperties();
                    routes.Add(r);

                    try
                    {
                        var qdtIrdTransaction = qdtEntities.qdt_ird_transaction.Single(n => n.ird_route_id == qdtIrdRoute.ird_route_id);
                        if (qdtIrdTransaction != null)
                        {
                            QdtIrdTransaction t = new QdtIrdTransaction(qdtIrdTransaction);
                            t.InitialProperties();
                            transactions.Add(t);
                        }
                    }
                    catch { }

                }
                return this.Direct(new
                    {
                        success = true,
                        routes = routes,
                        transactions = transactions
                    });
            }
            catch
            {
                return this.DirectFailure("Call Login GetRoutesBySerialNumberAndOperationNumber Failure!");
            }
        }

        [Obsolete]
        [DirectInclude]
        public ActionResult GetCharacteristicsByPartNumberAndOperationNumber(string partNumber, int operationNumber)
        {
            try
            {
                var irdCharacteristics = qdtEntities.qdtGetCharacteristicsByPartNumberAndOperationNumberSP(partNumber, operationNumber);

                List<QdtIrdCharacteristic> characteristics = new List<QdtIrdCharacteristic>();
                foreach (qdt_ird_characteristic irdCharacteristic in irdCharacteristics)
                {
                    QdtIrdCharacteristic c = new QdtIrdCharacteristic(irdCharacteristic);
                    c.InitialProperties();
                    characteristics.Add(c);
                }
                return this.DirectSuccess(characteristics.ToList().AsQueryable());
            }
            catch
            {
                return this.DirectFailure("Call Login GetCharacteristicsByPartNumberAndOperationNumber Failure!");
            }
        }

        [DirectInclude]
        public ActionResult GetModifiedCharacteristicsByIrdId(int irdId)
        {
            var irdModifiedCharacteristics = qdtEntities.qdtGetModifiedCharacteristicsByIrdIdSP(irdId).ToList();

            List<QdtIrdCharacteristic> modifiedCharacteristics = new List<QdtIrdCharacteristic>();
            foreach (qdt_ird_characteristic irdCharacteristic in irdModifiedCharacteristics)
            {
                QdtIrdCharacteristic c = new QdtIrdCharacteristic(irdCharacteristic);
                c.InitialProperties();
                modifiedCharacteristics.Add(c);
            }
            return this.DirectSuccess(modifiedCharacteristics);
        }

        [DirectInclude]
        public ActionResult GetOriginalCharacteristicsByCharId(int charId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var originalCharId = db.qdt_ird_characteristic.Single(n => n.char_id == charId).last_char_id;
                var originalCharacteristic = db.qdt_ird_characteristic.Single(n => n.char_id == originalCharId);
                QdtIrdCharacteristic c = new QdtIrdCharacteristic(originalCharacteristic);
                return this.DirectSuccess(c);
            }

        }


        [DirectInclude]
        public ActionResult CopyIrdDraft(int irdId)
        {
            try
            {
                var irdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == irdId);
                if (irdRevision.editor == GetCurrentUser().user_id)
                {
                    return this.DirectFailure("You are already editing this ird revision!");
                }
                else if (irdRevision.editor == null)
                {

                    // 在 ird_revision 表中进行lock， 表示正在编辑
                    LockIrdRevision(irdId, GetCurrentUser().user_id);
                    //在升版之后要解锁，或者用户放弃编辑的时候进行解锁，并且删除所有的draft records 

                    var characteristics = qdtEntities.qdt_ird_characteristic.Where(n => n.ird_id == irdId && n.revision_type.Equals("formal"));
                    foreach (qdt_ird_characteristic characteristic in characteristics)
                    {
                        qdt_ird_characteristic c = new qdt_ird_characteristic
                        {
                            ird_id = characteristic.ird_id,
                            oper_num = characteristic.oper_num,
                            char_seq = characteristic.char_seq,
                            char_num = characteristic.char_num,
                            char_type = characteristic.char_type,
                            blue_print_zone = characteristic.blue_print_zone,
                            basic_gage_id = characteristic.basic_gage_id,
                            fml_gage_id = characteristic.fml_gage_id,
                            char_description = characteristic.char_description,
                            characteristic = characteristic.characteristic,
                            basic_rec_type = characteristic.basic_rec_type,
                            fml_rec_type = characteristic.fml_rec_type,
                            char_maximum = characteristic.char_maximum,
                            char_minimum = characteristic.char_minimum,
                            gdnt_link = characteristic.gdnt_link,
                            oai_flag = characteristic.oai_flag,
                            oap_flag = characteristic.oap_flag,
                            is_cmm_flag = characteristic.is_cmm_flag,
                            need_cmm = characteristic.need_cmm,
                            line_qty = characteristic.line_qty,
                            last_char_id = characteristic.char_id,
                            cpk = characteristic.cpk,
                            spc_control = characteristic.spc_control,
                            spc_result = characteristic.spc_result,
                            revision_type = "draft"
                        };
                        qdtEntities.AddToqdt_ird_characteristic(c);
                    }
                    qdtEntities.SaveChanges();
                }
                else
                {
                    //      irdLock = true;
                    return this.DirectFailure("Some one is editing this ird, Please contact IT");
                }
            }
            catch
            {
                return this.DirectFailure("Search IRD with ird_id equels " + irdId + " failure");
            }

            return this.DirectSuccess();
        }

        [DirectInclude]
        public ActionResult SubmitNewIrdRevision(int ird_id, string rev_level, string part_num)
        {
            var form = Request.Form;

            qdtGetStandardJobByPartNumberSP_Result standardJob = new qdtGetStandardJobByPartNumberSP_Result();
            try
            {
                standardJob = qdtEntities.qdtGetStandardJobByPartNumberSP(part_num).Single();
            }
            catch
            {
                return this.DirectFailure("Call Login UpdateIrd failure -> get IrdRevision ");
            }

            // insert new ird revision

            var currentIrdRevision = qdtEntities.qdt_ird_revision.Where(n => n.ird_id == ird_id).Single();
            var newIrdRevision = new qdt_ird_revision
            {
                item = currentIrdRevision.item,
                revision = currentIrdRevision.revision + 1, // TODO: 这个应该是在approve之后进行的
                rev_level = rev_level, // 从form中取值
                marking_arrangement_id = currentIrdRevision.marking_arrangement_id,
                prepare_by = GetCurrentUser().user_id,
                prepare_date = System.DateTime.Now,
                verify_by = null,
                verify_date = null,
                approve_by = null,
                approve_date = null,
                job = standardJob.job,
                suffix = standardJob.suffix,
                editor = null,
                status = QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Prepared]
            };

            //  qdtEntities.AddToqdt_ird_revision(newIrdRevision);
            qdtEntities.qdt_ird_revision.AddObject(newIrdRevision);
            //  currentIrdRevision.editor = null;
            qdtEntities.SaveChanges();

            //update draft ird characteristics
            var characteristics = qdtEntities.qdt_ird_characteristic.Where(n => n.ird_id == ird_id && n.revision_type == "draft");
            foreach (qdt_ird_characteristic characteristic in characteristics)
            {
                characteristic.ird_id = newIrdRevision.ird_id;
                characteristic.revision_type = "formal";
            }
            UnlockIrdRevision(ird_id);
            return this.DirectSuccess();
        }


        [DirectInclude]
        public ActionResult DropIrdDraft(int ird_id)
        {
            try
            {
                var characteristics = qdtEntities.qdt_ird_characteristic.Where(n => n.ird_id == ird_id && n.revision_type == "draft");
                foreach (qdt_ird_characteristic characteristic in characteristics)
                {
                    qdtEntities.qdt_ird_characteristic.DeleteObject(characteristic);
                }
                qdtEntities.SaveChanges();
                UnlockIrdRevision(ird_id);
                return this.DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call method DropIrdDraft failure!");
            }
        }

        //public string GetIrdRevisionStatus(int ird_id)
        //{
        //    var irdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == ird_id);
        //    return irdRevision.status;
        //}

        [DirectInclude]
        public ActionResult VerifyIrdRevision(int ird_id)
        {
            try
            {
                var irdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == ird_id);
                if (!irdRevision.status.Equals(QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Prepared]))
                {
                    return this.DirectFailure("DpIrdController  VerifyIrdRevision : IRD状态有异常，请重新刷新页面！");
                }
                irdRevision.verify_by = GetCurrentUser().user_id;
                irdRevision.verify_date = System.DateTime.Now;
                irdRevision.status = QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Verified];
                qdtEntities.SaveChanges();
                return this.DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login VerifyIrdRevision Failed!");
            }
        }


        [DirectInclude]
        public ActionResult VerifyDenyIrdRevision(int ird_id)
        {
            try
            {
                var irdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == ird_id);
                if (!irdRevision.status.Equals(QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Prepared]))
                {
                    return this.DirectFailure("DpIrdController  VerifyIrdRevision : IRD状态有异常，请重新刷新页面！");
                }
                irdRevision.verify_by = GetCurrentUser().user_id;
                irdRevision.verify_date = System.DateTime.Now;
                irdRevision.status = QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.VerifyDeny];
                qdtEntities.SaveChanges();
                return this.DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login VerifyDenyIrdRevision Failed!");
            }
        }

        [DirectInclude]
        public ActionResult ApproveIrdRevision(int irdId)
        {
            try
            {
                var irdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == irdId);
                if (!irdRevision.status.Equals(QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Verified]))
                {
                    return this.DirectFailure("DpIrdController  VerifyIrdRevision : IRD状态有异常，请重新刷新页面！");
                }
                irdRevision.approve_by = GetCurrentUser().user_id;
                irdRevision.approve_date = System.DateTime.Now;
                irdRevision.status = QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Approved];
                qdtEntities.SaveChanges();


                //Update ird_id field in  Table slitem
                string item = irdRevision.item;
                var slItem = pmbEntities.sl_item.Single(n => n.item == item);
                slItem.ird_id = irdId;
                pmbEntities.SaveChanges();

                return this.DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login ApproveIrdRevision Failed!");
            }
        }


        [DirectInclude]
        public ActionResult ApproveDenyIrdRevision(int irdId)
        {
            try
            {
                var irdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == irdId);
                if (!irdRevision.status.Equals(QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Verified]))
                {
                    return this.DirectFailure("DpIrdController  VerifyIrdRevision : IRD状态有异常，请重新刷新页面！");
                }
                irdRevision.approve_by = GetCurrentUser().user_id;
                irdRevision.approve_date = System.DateTime.Now;
                irdRevision.status = QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.ApproveDeny];
                qdtEntities.SaveChanges();
                return this.DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login ApproveDenyIrdRevision Failed!");
            }
        }



        [DirectInclude]
        public ActionResult GetOperationComments(string serial, int operNum)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var route = db.qdt_ird_route.Where(n => n.serial.Equals(serial) && n.oper_num == operNum).First();
                return this.DirectSuccess(route);
            }
        }

        [DirectInclude]
        [FormHandler]
        public ActionResult UpdateComments()
        {
            var form = Request.Form;
            string serial = form["serial"];
            int operNum = Convert.ToInt32(form["oper_num"]);
            string comment1 = form["comment1"];
            string comment2 = form["comment2"];

            using (QDTEntities db = new QDTEntities())
            {
                var routes = db.qdt_ird_route.Where(n => n.serial.Equals(serial) && n.oper_num == operNum).ToList();
                foreach (var route in routes)
                {
                    route.comment1 = comment1;
                    route.comment2 = comment2;
                    route.update_by = this.GetCurrentUser().user_id;
                    route.update_date = System.DateTime.Now;
                    db.SaveChanges();
                }
            }

            return this.DirectSuccess();
        }


        [DirectInclude]
        public ActionResult SavePassTransaction(int irdRouteId, int charId, string inspectTpye, Boolean pass, int user_id)
        {
            try
            {
                qdt_ird_transaction rangeTransaction = new qdt_ird_transaction()
                {
                    ird_route_id = irdRouteId,
                    inspect_type = inspectTpye,
                    char_id = charId,
                    record_by = user_id,
                    record_date = System.DateTime.Now,
                    rec_passed = pass
                };

                qdtEntities.qdt_ird_transaction.AddObject(rangeTransaction);
                qdtEntities.SaveChanges();

                return this.DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login SavePassTransaction Failed!");
            }
        }

        [DirectInclude]
        public ActionResult SaveValueTransaction(int irdRouteId, int charId, string inspectTpye, decimal value, int user_id)
        {
            try
            {
                qdt_ird_transaction rangeTransaction = new qdt_ird_transaction()
                {
                    ird_route_id = irdRouteId,
                    inspect_type = inspectTpye,
                    char_id = charId,
                    record_by = user_id,
                    record_date = System.DateTime.Now,
                    rec_value = value
                };

                qdtEntities.qdt_ird_transaction.AddObject(rangeTransaction);
                qdtEntities.SaveChanges();

                return this.DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login SaveValueTransaction Failed!");
            }
        }


        [DirectInclude]
        public ActionResult SaveRangeTransaction(int irdRouteId, int charId, string inspectTpye, decimal min, decimal max, int user_id)
        {
            try
            {
                qdt_ird_transaction rangeTransaction = new qdt_ird_transaction()
                {
                    ird_route_id = irdRouteId,
                    inspect_type = inspectTpye,
                    char_id = charId,
                    record_by = user_id,
                    record_date = System.DateTime.Now,
                    rec_minimum = min,
                    rec_maximum = max,
                };

                qdtEntities.qdt_ird_transaction.AddObject(rangeTransaction);
                qdtEntities.SaveChanges();

                return this.DirectSuccess();
            }
            catch
            {
                return this.DirectFailure("Call Login SaveRangeTransaction Failed!");
            }
        }


        [DirectInclude]
        [FormHandler]
        public ActionResult ExportSpc()
        {
            try
            {
                var form = Request.Form;
                string partNum = form["part_num"];
                int operNum = Convert.ToInt32(form["oper_num"]);
                string charNum = form["char_num"];
                string fmlMark = form["fml_mark"];
                int inspectionType = Convert.ToInt32(form["inspection_type"]);
                DateTime startDate = Convert.ToDateTime(form["start_date"]).Date;
                DateTime endDate = Convert.ToDateTime(form["end_date"]).Date;
                TimeSpan startTime = Convert.ToDateTime(form["start_time"]).TimeOfDay;
                TimeSpan endTime = Convert.ToDateTime(form["end_time"]).TimeOfDay;

                DateTime start = startDate.Add(startTime);
                DateTime end = endDate.Add(endTime);

                using (QDTEntities db = new QDTEntities())
                {
                    var transactions = db.qdtGetSpcSP(partNum, operNum, charNum, start, end, fmlMark, inspectionType).ToList();

                    //创建空白文档
                    HSSFWorkbook workbook = new HSSFWorkbook();
                    //创建标准三页
                    ISheet sheet1 = workbook.CreateSheet("sheet1");

                    IRow headrow = sheet1.CreateRow(0);//创建第一行
                    //将DataTable的列写入第一g


                    //column.Oradinal,列的位置,column.ColumnName,列名
                    headrow.CreateCell(0).SetCellValue("serial");//写入
                    headrow.CreateCell(1).SetCellValue("job");//写入
                    headrow.CreateCell(2).SetCellValue("suffix");//写入
                    headrow.CreateCell(3).SetCellValue("item");//写入
                    headrow.CreateCell(4).SetCellValue("oper_num");//写入
                    headrow.CreateCell(5).SetCellValue("characteristic");//写入
                    headrow.CreateCell(6).SetCellValue("trans_num");//写入
                    headrow.CreateCell(7).SetCellValue("ird_route_id");//写入
                    headrow.CreateCell(8).SetCellValue("inspect_type");//写入
                    headrow.CreateCell(9).SetCellValue("record_by");//写入
                    headrow.CreateCell(10).SetCellValue("record_date");//写入
                    headrow.CreateCell(11).SetCellValue("rec_maximum");//写入
                    headrow.CreateCell(12).SetCellValue("rec_minimum");//写入
                    headrow.CreateCell(13).SetCellValue("rec_value");//写入
                    headrow.CreateCell(15).SetCellValue("rec_passed");//写入
                    headrow.CreateCell(16).SetCellValue("sso");//写入
                    headrow.CreateCell(17).SetCellValue("name_cn");//写入
                    headrow.CreateCell(18).SetCellValue("name_en");//写入



                    //再写入记录值 
                    IRow row;
                    int i = 1;
                    foreach (var transaction in transactions)
                    {
                        row = sheet1.CreateRow(i);
                        row.CreateCell(0).SetCellValue(transaction.serial);//写入
                        row.CreateCell(1).SetCellValue(transaction.job);//写入
                        row.CreateCell(2).SetCellValue(transaction.suffix.ToString());//写入
                        row.CreateCell(3).SetCellValue(transaction.item);//写入
                        row.CreateCell(4).SetCellValue(transaction.oper_num.ToString());//写入
                        row.CreateCell(5).SetCellValue(transaction.characteristic);//写入
                        row.CreateCell(6).SetCellValue(transaction.trans_num);//写入
                        row.CreateCell(7).SetCellValue(transaction.ird_route_id.ToString());//写入
                        row.CreateCell(8).SetCellValue(transaction.inspect_type);//写入
                        row.CreateCell(9).SetCellValue(transaction.record_by.ToString());//写入
                        row.CreateCell(10).SetCellValue(transaction.record_date.ToString());//写入
                        row.CreateCell(11).SetCellValue(transaction.rec_maximum.ToString());//写入
                        row.CreateCell(12).SetCellValue(transaction.rec_minimum.ToString());//写入
                        row.CreateCell(13).SetCellValue(transaction.rec_value.ToString());//写入
                        row.CreateCell(15).SetCellValue(transaction.rec_passed.ToString());//写入
                        row.CreateCell(16).SetCellValue(transaction.sso);//写入
                        row.CreateCell(17).SetCellValue(transaction.name_cn);//写入
                        row.CreateCell(18).SetCellValue(transaction.name_en);//写入
                        i++;
                    }



                    using (FileStream file = new FileStream(@"c:\gary\text.xls", FileMode.Create))
                    {
                        workbook.Write(file);//写入
                        file.Dispose();

                    }

                    return this.DirectSuccess();
                }



            }
            catch
            {
                return this.DirectFailure("Call Method DpIrdController ExportSpc Failed!");
            }
        }


        [DirectInclude]
        [FormHandler]
        public ActionResult GetSpc()
        {
            try
            {
                var form = Request.Form;
                string partNum = form["part_num"];
                int operNum = Convert.ToInt32(form["oper_num"]);
                string charNum = form["char_num"];
                string fmlMark = form["fml_mark"];
                int inspectionType = Convert.ToInt32(form["inspection_type"]);
                DateTime startDate = Convert.ToDateTime(form["start_date"]).Date;
                DateTime endDate = Convert.ToDateTime(form["end_date"]).Date;
                TimeSpan startTime = Convert.ToDateTime(form["start_time"]).TimeOfDay;
                TimeSpan endTime = Convert.ToDateTime(form["end_time"]).TimeOfDay;

                DateTime start = startDate.Add(startTime);
                DateTime end = endDate.Add(endTime);

                using (QDTEntities db = new QDTEntities())
                {

                    //var route = db.qdt_ird_route.Where(
                    //    n => n.item.ToUpper().Equals(partNum.ToUpper())
                    //    && n.oper_num == operNum
                    //    && n.char_num.ToUpper().Equals(charNum.ToUpper())
                    //    ).ToList();




                    var transactions = db.qdtGetSpcSP(partNum, operNum, charNum, start, end, fmlMark, inspectionType).ToList();

                    string recordType = "";

                    if (fmlMark.Equals("others"))
                    {
                        recordType = transactions[0].basic_rec_type;
                    }
                    else
                    {
                        recordType = transactions[0].fml_rec_type;
                    }

                    decimal? max_max_value = transactions.Max(n => n.rec_maximum) ?? (decimal?)0;
                    decimal? min_min_value = transactions.Min(n => n.rec_minimum) ?? (decimal?)0;

                    decimal? max_value = transactions.Max(n => n.rec_value);
                    decimal? min_value = transactions.Min(n => n.rec_value);


                    int ird_id = db.sl_item.Single(n => n.item.ToUpper().Equals(partNum.ToUpper())).ird_id.Value;


                    decimal standard_max_value = db.qdt_ird_characteristic.Single(n =>
                        n.ird_id == ird_id
                        && n.oper_num == operNum
                        && n.char_num.ToUpper().Equals(charNum.ToUpper())).char_maximum.Value;



                    decimal standard_min_value = db.qdt_ird_characteristic.Single(n =>
                          n.ird_id == ird_id
                        && n.oper_num == operNum
                        && n.char_num.ToUpper().Equals(charNum.ToUpper())).char_minimum.Value;


                    decimal line1 = standard_max_value + (standard_max_value - standard_min_value) * (decimal)0.1;
                    decimal line2 = standard_max_value;
                    decimal line3 = standard_max_value - (standard_max_value - standard_min_value) * (decimal)0.25;

                    decimal line4 = (standard_max_value + standard_min_value) * (decimal)0.5;

                    decimal line5 = standard_min_value + (standard_max_value - standard_min_value) * (decimal)0.25;
                    decimal line6 = standard_min_value;
                    decimal line7 = standard_min_value - (standard_max_value - standard_min_value) * (decimal)0.1;


                    foreach (var transaction in transactions)
                    {

                        transaction.line1 = line1;
                        transaction.line2 = line2;
                        transaction.line3 = line3;
                        transaction.line4 = line4;
                        transaction.line5 = line5;
                        transaction.line6 = line6;
                        transaction.line7 = line7;
                        if (transaction.rec_maximum > line1)
                        {
                            transaction.rec_maximum = line1;
                        }

                        if (transaction.rec_maximum < line7)
                        {
                            transaction.rec_maximum = line7;
                        }


                        if (transaction.rec_minimum > line1)
                        {
                            transaction.rec_minimum = line1;
                        }

                        if (transaction.rec_minimum < line7)
                        {
                            transaction.rec_minimum = line7;
                        }


                        if (transaction.rec_value > line1)
                        {
                            transaction.rec_value = line1;
                        }

                        if (transaction.rec_value < line7)
                        {
                            transaction.rec_value = line7;
                        }

                    }



                    return this.Direct(new
                    {
                        data = transactions,
                        record_type = recordType,
                        line1 = line1,
                        line7 = line7,
                        success = true

                    });


                }
            }
            catch
            {
                return this.DirectFailure("Call Method DpIrdController GetSpc Failed!");
            }


        }

        private void UnlockIrdRevision(int ird_id)
        {
            var ird_revision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == ird_id);
            ird_revision.editor = null;
            qdtEntities.SaveChanges();
        }

        private void LockIrdRevision(int ird_id, int user_id)
        {
            var ird_revision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == ird_id);
            ird_revision.editor = user_id;
            qdtEntities.SaveChanges();
        }

        private bool CanEdit(int ird_id, int user_id)
        {

            var irdRevisionCount = qdtEntities.qdt_ird_revision.Count(n => n.ird_id == ird_id);
            if (irdRevisionCount == 0)
            {
                return true;
            }
            var irdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == ird_id);
            if (irdRevision.editor == null || irdRevision.editor == user_id)
            {
                return true;
            }
            return false;
        }
        //private void MarkingEditIrdRevision(int ird_id)
        //{
        //    try
        //    {
        //        var irdRevision = qdtEntities.qdt_ird_revision.Single(n => n.ird_id == ird_id);
        //        irdRevision.editor = GetCurrentUser().user_id;
        //        irdRevision.status = QdtIrdRevision.IrdRevisionStatuses[IrdRevisionStatus.Unprepared];
        //        qdtEntities.SaveChanges();
        //    }
        //    catch
        //    {
        //        this.DirectFailure("Call Login MarkingEditingIrdRevision Failure!");
        //    }
        //}
    }
}
