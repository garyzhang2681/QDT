using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using com.ge.szit.Suzhou_Intranet_V3.Utility;
using Ext.Direct.Mvc;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ProductionManagement.Models.EntityModel;
using SuzhouHr.Models.EntityModel;
using SZIntraV3_1_WebSite.Models;
using SZIntraV3_1_WebSite.Models.Dr;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;
using SZIntraV3_1_WebSite.Models.QueryParametersSet;
using SZIntraV3_1_WebSite.Models.System;
using SZIntraV3_1_WebSite.Utility;
using Common.Utility.Extension;
using DispositionStatus = SZIntraV3_1_WebSite.Models.DispositionStatus;
using DrStatus = SZIntraV3_1_WebSite.Models.DrStatus;

namespace SZIntraV3_1_WebSite.Controllers
{
    public class QDTController : DirectHelper
    {
        //Dummy code, client js file has its 'default lang' setting in code
        private string DEFAULT_LANG = "cn";

        private SystemAdminController sa = new SystemAdminController();
        private QDTEntities qdtEntities = new QDTEntities();
        private SuzhouHrEntities hrEntities = new SuzhouHrEntities();
        private SystemAdminEntities systemAdminEntities = new SystemAdminEntities();
        /// <summary>
        /// Get current user
        /// </summary>
        /// <returns>User object in Session</returns>
        private User GetCurrentUser()
        {
            try
            {


                User user = null;

                if (Session["user"] != null)
                {
                    user = (User)Session["user"];
                }
                else if (Request.Cookies["user"] != null)
                {
                    JObject cookieUser = JObject.Parse(HttpUtility.UrlDecode(Request.Cookies["user"].Value));
                    int userId = cookieUser["user_id"].Value<int>();
                    string lang = cookieUser["lang"].Value<string>();
                    using (SystemAdminEntities db = new SystemAdminEntities())
                    {
                        user = new User(db.sys_user.Single(n => n.user_id == userId), lang);
                        AddUserSession(user);
                        user = (User)Session["user"];
                    }
                }
                return user;
            }
            catch
            {
                return null;
            }
        }



        private int GetProgramId()
        {
            return sa.sae.sys_program.Where(n => n.program_name == "QDT").Single().id;
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

        public ActionResult Index()
        {
            var lang = GetLang();
            ViewBag.lang = lang;
            return View();
        }


        #region User


        //TODO: add resource files to localize errorMessage
        [FormHandler]
        [DirectInclude]
        public ActionResult UserLogin()
        {
            var form = Request.Form;
            string sso = form["sso"],
                password = form["password"],
                lang = form["lang"];

            return DoUserLogin(sso, password, lang);
        }

        [DirectInclude]
        public ActionResult UserLogout()
        {
            Session.Abandon();
            return DirectSuccess();
        }

        /// <summary>
        /// Used to login with user cookie
        /// </summary>
        /// <param name="sso"></param>
        /// <param name="password"></param>
        /// <param name="lang"></param>
        /// <returns></returns>
        /// 
        [DirectInclude]
        public ActionResult DoUserLogin(string sso, string password, string lang)
        {
            LoginResult result = sa.UserLogin(sso, password, lang);
            if (result.success)
            {
                AddUserSession(result.user);
            }
            return this.Direct(result);
        }

        private void AddUserSession(User user)
        {
            if (Session["user"] == null)
            {
                Session.Add("user", user);
            }
        }


        [FormHandler]
        [DirectInclude]
        public ActionResult ChangePassword()
        {
            try
            {

                var form = Request.Form;
                string password = form["password"],
                    newPassword = form["new_password"],
                    confirmPassword = form["confirm_password"];
                int userId = Convert.ToInt32(form["user_id"]);
                if (newPassword.Equals(confirmPassword))
                {
                    sa.ChangePassword(GetCurrentUser(), password, newPassword);
                }
                else
                {
                    return this.Direct(new
                    {
                        errorMessage = "两次密码不一致，请重新输入！"
                    });
                }
                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }
        #endregion

        #region Prerequisite
        [DirectInclude]
        public ActionResult GetLangData()
        {
            try
            {
                return this.Direct(new
                {
                    success = true,
                    data = sa.GetLangData(GetProgramId(), GetLang())
                });
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        /// <summary>
        /// Get user's widget action permission mapping
        /// TODO: call( create) method in system admin controller
        /// </summary>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult GetPermission()
        {
            using (QDTEntities db = new QDTEntities())
            {
                return this.Direct(new
                {
                    success = true,
                    data = qdtEntities.sysGetPermissionSP(GetCurrentUser().user_id)
                });
            }
        }

        [DirectInclude]
        public ActionResult GetTreeMenu(string node, string usersso)
        {
            usersso = GetCurrentUser().sso;
            return sa.GetTreeMenu(GetProgramId(), node, usersso, GetLang());
        }
        #endregion


        #region DR

        [DirectInclude]
        public ActionResult SearchDrs(JObject o)
        {

            var searchConditions = o["searchConditions"];

            QdtDrQueryModel queryParameters = new QdtDrQueryModel();

            queryParameters.dr_num = searchConditions["dr_num"].Value<String>();
            queryParameters.production_line = searchConditions["production_line"].Value<String>();
            queryParameters.part_num = searchConditions["part_num"].Value<String>();
            queryParameters.job_card = searchConditions["job_card"].Value<String>();
            queryParameters.due_date_from = searchConditions["due_date_from"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["due_date_from"].Value<string>()).Year,
                Convert.ToDateTime(searchConditions["due_date_from"].Value<string>()).Month,
                Convert.ToDateTime(searchConditions["due_date_from"].Value<string>()).Day, 0, 0, 0);
            queryParameters.due_date_to = searchConditions["due_date_to"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["due_date_to"].Value<string>()).Year,
                Convert.ToDateTime(searchConditions["due_date_to"].Value<string>()).Month,
                Convert.ToDateTime(searchConditions["due_date_to"].Value<string>()).Day + 1, 0, 0, 0);
            queryParameters.create_date_from = searchConditions["create_date_from"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["create_date_from"].Value<string>()).Year,
                Convert.ToDateTime(searchConditions["create_date_from"].Value<string>()).Month,
                Convert.ToDateTime(searchConditions["create_date_from"].Value<string>()).Day, 0, 0, 0);
            queryParameters.create_date_to = searchConditions["create_date_to"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["create_date_to"].Value<string>()).Year,
                Convert.ToDateTime(searchConditions["create_date_to"].Value<string>()).Month,
                Convert.ToDateTime(searchConditions["create_date_to"].Value<string>()).Day + 1, 0, 0, 0);
            queryParameters.qe_owner = searchConditions["dr_qe_owner"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["dr_qe_owner"].Value<string>());
            queryParameters.me_owner = searchConditions["dr_me_owner"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["dr_me_owner"].Value<string>());
            queryParameters.act_owner = searchConditions["act_owner"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["act_owner"].Value<string>());
            queryParameters.dr_type = searchConditions["dr_type"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["dr_type"].Value<string>());
            queryParameters.reason_code = searchConditions["reason_code"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["reason_code"].Value<string>());
            queryParameters.dr_creator = searchConditions["dr_creator"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["dr_creator"].Value<string>());

            List<qdt_dr> drs = new List<qdt_dr>();

            if (searchConditions["status"].HasValues)
            {
                List<JToken> statuses = searchConditions["status"].ToList();
                foreach (JToken status in statuses)
                {
                    queryParameters.dr_status = status.Value<string>();
                    drs.AddRange(queryParameters.QueryDrs());
                }
            }
            else
            {
                drs = queryParameters.QueryDrs();
            }


            List<QdtDiscrepancyReport> qdtDrs = new List<QdtDiscrepancyReport>();
            foreach (qdt_dr dr in PagedData(o, drs.AsQueryable()))
            {

                var qdtDiscrepancyReport = new QdtDiscrepancyReport(dr);
                qdtDiscrepancyReport.InitialProperties();
                qdtDrs.Add(qdtDiscrepancyReport);
            }

            //     JObject o = new JObject();
            return this.Direct(new
            {
                data = qdtDrs,
                total = drs.Count,
                success = true
            });
        }

        [DirectInclude]
        public ActionResult GetRelatedDr(JObject o)
        {
            int userId = GetCurrentUser().user_id;
            int employeeId = SystemAdminController.GetEmployeeIdByUserId(userId);
            string sApproved = QdtAction.ActionStatuses[QdtAction.ActionStatus.Approved];

            List<qdt_dr> relatedDrs = new List<qdt_dr>();



            QdtDrQueryModel queryParameters = new QdtDrQueryModel();
            //queryParameters.qe_owner = employeeId;
            //queryParameters.dr_status = QdtDiscrepancyReport.DrStatuses[DrStatus.Open];
            //relatedDrs.AddRange(queryParameters.QueryDrs());

            //queryParameters = new QdtDrQueryModel();
            //queryParameters.me_owner = employeeId;
            //queryParameters.dr_status = QdtDiscrepancyReport.DrStatuses[DrStatus.Open];
            //relatedDrs.AddRange(queryParameters.QueryDrs());

            //queryParameters = new QdtDrQueryModel();
            //queryParameters.act_owner = employeeId;
            //queryParameters.dr_status = QdtDiscrepancyReport.DrStatuses[DrStatus.Open];
            //relatedDrs.AddRange(queryParameters.QueryDrs());
            //

            queryParameters = new QdtDrQueryModel();
            queryParameters.qe_owner = employeeId;
            queryParameters.dr_status = QdtDiscrepancyReport.DrStatuses[DrStatus.PendingQEME];
            relatedDrs.AddRange(queryParameters.QueryDrs());

            queryParameters = new QdtDrQueryModel();
            queryParameters.me_owner = employeeId;
            queryParameters.dr_status = QdtDiscrepancyReport.DrStatuses[DrStatus.PendingQEME];
            relatedDrs.AddRange(queryParameters.QueryDrs());

            queryParameters = new QdtDrQueryModel();
            queryParameters.me_owner = employeeId;
            queryParameters.dr_status = QdtDiscrepancyReport.DrStatuses[DrStatus.PendingME];
            relatedDrs.AddRange(queryParameters.QueryDrs());

            queryParameters = new QdtDrQueryModel();
            queryParameters.act_owner = employeeId;
            queryParameters.dr_status = QdtDiscrepancyReport.DrStatuses[DrStatus.PendingAction];
            relatedDrs.AddRange(queryParameters.QueryDrs());



            relatedDrs = relatedDrs.GroupBy(n => n.dr_num).Select(group => @group.First()).ToList();

            foreach (qdt_dr dr in relatedDrs.ToList())
            {
                string drNumber = dr.dr_num;
                if (qdtEntities.qdt_action.Count(n => n.dr_num == drNumber && n.status == sApproved && n.act_owner == employeeId) == 0
                    && dr.dr_me_owner != employeeId && dr.dr_qe_owner != employeeId)
                {
                    relatedDrs.Remove(dr);
                }
            }

            List<QdtDiscrepancyReport> qdtRelatedDrs = new List<QdtDiscrepancyReport>();
            QdtDiscrepancyReport qdtRelatedDr = new QdtDiscrepancyReport();
            foreach (qdt_dr dr in PagedData(o, relatedDrs.AsQueryable()))
            {
                qdtRelatedDr = new QdtDiscrepancyReport(dr);
                qdtRelatedDr.InitialProperties();
                qdtRelatedDrs.Add(qdtRelatedDr);
            }


            return this.Direct(new
            {
                data = qdtRelatedDrs,
                total = relatedDrs.Count,
                DirectSuccess = true
            });
        }

        [DirectInclude]
        public ActionResult CloseDr(string dr_num)
        {
            qdtEntities.qdtCloseDrSP(GetCurrentUser().user_id, dr_num);

            SendNotification(EmailType.QdtDiscrepancyReportClosed, dr_num);

            return DirectSuccess();
        }

        [DirectInclude]
        public ActionResult GetDrStatuses()
        {
            List<string> drStatuses = new List<string>();
            foreach (string drStatus in QdtDiscrepancyReport.DrStatuses.Values)
            {
                drStatuses.Add(drStatus);
            }
            return this.Direct(new
            {
                data = drStatuses.Select(n => new { status = n }).Distinct().ToList()
            });
        }

        //TODO: !!!
        [DirectInclude]
        public ActionResult DRListCombo(JObject o)
        {
            string query = o["query"].Value<string>();
            List<qdt_dr> drs = qdtEntities.qdt_dr.Where(n => n.dr_num.ToUpper().Contains(query.ToUpper())).ToList();
            List<QdtDiscrepancyReport> comboDrs = new List<QdtDiscrepancyReport>();
            foreach (qdt_dr dr in drs)
            {
                QdtDiscrepancyReport qdtDiscrepancyReport = new QdtDiscrepancyReport(dr);
                qdtDiscrepancyReport.InitialProperties();
                comboDrs.Add(qdtDiscrepancyReport);
            }
            return this.Direct(new
            {

                data = PagedData(o, comboDrs.AsQueryable()),
                total = comboDrs.Count()
            });
        }

        [DirectInclude]
        public ActionResult IsEmptyDr(string drNum)
        {
            var isEmptyDr = !qdtEntities.qdt_disposition.Any(n => n.dr_num.Equals(drNum));

            return this.Direct(new
            {
                success = true,
                isEmptyDr = isEmptyDr
            });

        }

        [DirectInclude]
        public ActionResult DeleteDr(String drNum)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    if (GetCurrentUser().sso.Equals("212348763"))
                    {
                        db.qdtDeleteDRSP(drNum);
                        return this.DirectSuccess();
                    }

                    if (db.qdt_disposition.Count(n => n.dr_num.Equals(drNum)) == 0 &&
                        db.qdt_dr.Single(n => n.dr_num.Equals(drNum)).create_by == GetCurrentUser().user_id)
                    {
                        db.qdtDeleteDRSP(drNum);
                        return this.DirectSuccess();
                    }
                    else
                    {
                        return this.DirectFailure("删除DR失败");
                    }
                }
            }
            catch
            {
                return this.DirectFailure("删除DR失败");
            }
        }


        [FormHandler]
        [DirectInclude]
        public ActionResult UpdateDR()
        {
            var form = Request.Form;

            using (PmbEntities db = new PmbEntities())
            {
                #region update dr
                string workCenter = "";
                var drNum = form["dr_num"];
                try
                {
                    workCenter =
                        qdtEntities.pmbGetWorkCenterSP(form["job"], Convert.ToInt32(form["suffix"]),
                            Convert.ToInt32(form["oper_num"])).Single();
                }
                catch
                {
                }
                string item_string = form["discrepancy_item"];
                ProductionManagement.Models.EntityModel.sl_item item =
                    db.sl_item.Where(n => n.item == item_string).Single();


                #region update discrepancy


                string discrepancies = Request.Params["discrepancies"];
                var discrepancyList = System.Web.Helpers.Json.Decode(discrepancies);
                bool discrepancyNotComplete = false;

                foreach (var discrepancy in discrepancyList)
                {
                    if (((string)discrepancy.description).Trim().Equals("") ||
                        ((string)discrepancy.NormalDescription).Trim().Equals(""))
                    {
                        discrepancyNotComplete = true;
                    }
                }
                if (discrepancyNotComplete)
                {
                    return this.Direct(new
                    {
                        success = true,
                        errorMessage = "请正确输入不符合项",
                        hasProblem = true
                    });
                }

                var qdtDiscrepancies = qdtEntities.qdt_discrepancy.Where(n => n.dr_num == drNum);
                foreach (var qdtDiscrepancy in qdtDiscrepancies)
                {
                    qdtEntities.qdt_discrepancy.DeleteObject(qdtDiscrepancy);
                }
                qdtEntities.SaveChanges();

                foreach (var discrepancy in discrepancyList)
                {

                    qdt_discrepancy disc = new qdt_discrepancy()
                    {
                        description = discrepancy.description,
                        NormalDescription = discrepancy.NormalDescription,
                        dr_num = drNum
                    };
                    qdtEntities.qdt_discrepancy.AddObject(disc);
                }

                qdtEntities.SaveChanges();
                #endregion



                var dr = qdtEntities.qdt_dr.Single(n => n.dr_num == drNum);
                dr.dr_type = Convert.ToInt32(form["dr_type"]);
                dr.dr_qe_owner = Convert.ToInt32(form["dr_qe_owner"]);
                dr.dr_me_owner = Convert.ToInt32(form["dr_me_owner"]);
                dr.source = Convert.ToInt32(form["source"]);
                dr.job = form["job"] ?? "";
                dr.suffix = Convert.ToInt32(form["suffix"]);
                dr.description = form["dr_description"];
                dr.serial = form["serialOrLot"].Equals("serial") ? form["serial_lot"] : "";
                dr.lot = form["serialOrLot"].Equals("lot") ? form["serial_lot"] : "";
                dr.discrepancy_item = form["discrepancy_item"];
                dr.quantity = Convert.ToInt32(form["quantity"]);
                dr.update_by = Convert.ToInt32(form["create_by"]);
                dr.update_date = DateTime.Now;
                dr.oper_num = form["oper_num"] == "" ? 0 : Convert.ToInt32(form["oper_num"]);
                dr.wc = workCenter;
                dr.Uf_item_ge_project = item.Uf_item_ge_project;

                qdtEntities.SaveChanges();
                #endregion
            }

            return this.DirectSuccess();
        }




        [FormHandler]
        [DirectInclude]
        public ActionResult CreateScrappedRecord()
        {

            try
            {

                var form = Request.Form;
                int record_by = Convert.ToInt32(form["create_by"]);
                int scrapped_by = Convert.ToInt32(form["scrapped_by"]);
                DateTime scrapped_date = Convert.ToDateTime(form["scrapped_date"]);
                DateTime create_date = DateTime.Now;
                int skill_code_id = Convert.ToInt32(form["skill_code_id"]);
                string remark = form["remark"];
                qdt_scrapped_record qsc = new qdt_scrapped_record()
                {
                    record_by = record_by,
                    scrapped_by = scrapped_by,
                    scrapped_date = scrapped_date,
                    skill_code_id = skill_code_id,
                    create_date = create_date,
                    remark = remark

                };

                qdtEntities.qdt_scrapped_record.AddObject(qsc);
                qdtEntities.SaveChanges();

                return this.Direct(new
                {
                    success = true
                  
                });
            }
            catch
            {
                return DirectFailure("Call Login QDTController.CreateScrappedRecord failed!");
            }
            return null;
        }

        [FormHandler]
        [DirectInclude]
        public ActionResult CreateDR()
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    var form = Request.Form;
                    string drNum = qdtEntities.qdtGenerateNumberSP("dr_num").Single().ToString();
                    string workCenter = "";
                    try
                    {
                        workCenter = qdtEntities.pmbGetWorkCenterSP(form["job"], Convert.ToInt32(form["suffix"]), Convert.ToInt32(form["oper_num"])).Single();
                    }
                    catch
                    {
                    }
                    string item_string = form["discrepancy_item"];
                    ProductionManagement.Models.EntityModel.sl_item item = db.sl_item.Where(n => n.item == item_string).Single();

                    #region add discrepancy

                    string discrepancies = Request.Params["discrepancies"];
                    var discrepancyList = System.Web.Helpers.Json.Decode(discrepancies);
                    int discrepancyCount = 0;

                    foreach (var discrepancy in discrepancyList)
                    {
                        if (!((string)discrepancy.description).Trim().Equals("") &&
                            !((string)discrepancy.NormalDescription).Trim().Equals(""))
                        {
                            qdt_discrepancy disc = new qdt_discrepancy()
                            {
                                description = discrepancy.description,
                                NormalDescription = discrepancy.NormalDescription,
                                dr_num = drNum
                            };
                            qdtEntities.qdt_discrepancy.AddObject(disc);
                            discrepancyCount++;
                        }

                    }

                    if (discrepancyCount == 0)
                    {

                        return this.Direct(new
                        {
                            success = true,
                            errorMessage = "请正确输入不符合项",
                            hasProblem = true
                        });
                    }

                    qdtEntities.SaveChanges();
                    #endregion


                    //int discrepancyCount = 0;
                    //foreach (var key in form.AllKeys.Where(n => n.Contains("discrepancy_list#")))
                    //{
                    //    if (key.Contains("Normal"))
                    //    {
                    //        if (!form[key].Trim().Equals("") && !form[key.Replace("Normal", "Discrepancy")].Trim().Equals("")) //如果为空，则不添加
                    //        {

                    //            discrepancyCount++;
                    //            var discrepancy = new qdt_discrepancy()
                    //            {
                    //                dr_num = drNum,
                    //                NormalDescription = form[key],
                    //                description = form[key.Replace("Normal", "Discrepancy")]
                    //            };
                    //            qdtEntities.qdt_discrepancy.AddObject(discrepancy);
                    //            qdtEntities.SaveChanges();
                    //        }
                    //    }

                    //}


                    //if (discrepancyCount == 0)
                    //{
                    //    return DirectFailure("Create Failed! Please input Discrepancy!");
                    //}


                    //创建DR，状态置为Pending ME
                    qdt_dr dr = new qdt_dr()
                    {
                        dr_num = drNum,
                        dr_type = Convert.ToInt32(form["dr_type"]),
                        dr_qe_owner = Convert.ToInt32(form["dr_qe_owner"]),
                        dr_me_owner = Convert.ToInt32(form["dr_me_owner"]),
                        source = Convert.ToInt32(form["source"]),
                        job = form["job"] ?? "",
                        suffix = Convert.ToInt32(form["suffix"]),
                        create_date = DateTime.Now,
                        create_by = Convert.ToInt32(form["create_by"]),
                        due_date = DateTime.Now.AddMonths(3),
                        close_date = null,
                        close_by = null,
                        description = form["dr_description"],
                        status = QdtDiscrepancyReport.DrStatuses[DrStatus.PendingME],
                        serial = form["serialOrLot"].Equals("serial") ? form["serial_lot"] : "",
                        lot = form["serialOrLot"].Equals("lot") ? form["serial_lot"] : "",
                        discrepancy_item = item_string,
                        quantity = Convert.ToInt32(form["quantity"]),
                        update_by = Convert.ToInt32(form["create_by"]),
                        update_date = DateTime.Now,
                        oper_num = form["oper_num"] == "" ? 0 : Convert.ToInt32(form["oper_num"]),
                        wc = workCenter,
                        Uf_item_ge_project = item.Uf_item_ge_project
                    };

                    string fileLocation = "/qdtDrAttachments/";

                    int attachmentCount = 1;
                    foreach (string f in Request.Files)
                    {
                        HttpPostedFileBase file = Request.Files[f];
                        if (file != null && file.ContentLength > 0)
                        {

                            // string path = @"\\TNWD07986\dr\"; 
                            string path = Server.MapPath(fileLocation);  //map to the server path

                            string fileName = drNum + "_" +
                                              file.FileName.Substring(file.FileName.LastIndexOf('\\') + 1, file.FileName.LastIndexOf('.') - file.FileName.LastIndexOf('\\') - 1) + "_" +
                                              DateTime.Now.Year + "_" +
                                              DateTime.Now.Month + "_" +
                                              DateTime.Now.Day + "_" +
                                              attachmentCount++ + "." +
                                              file.FileName.Split('.')[file.FileName.Split('.').Length - 1];   //TODO: fileName hard coding
                            try
                            {
                                SystemAdminController.AddAttachment("dr", drNum, path + fileName, GetCurrentUser().user_id);
                                file.SaveAs(path + fileName);//保存文件
                                //      SystemAdminController.AddAttachment("dr",dr_num,path+fileName,GetCurrentUser().user_id);
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

                    qdtEntities.qdt_dr.AddObject(dr);
                    qdtEntities.SaveChanges();

                    SendNotification(EmailType.QdtNewDiscrepancyReport, dr.dr_num);

                    var qeOwner = sa.GetEmployeeById(dr.dr_qe_owner.Value);
                    var meOwner = sa.GetEmployeeById(dr.dr_me_owner.Value);
                    return this.Direct(new
                    {
                        success = true,
                        dr = new QdtDiscrepancyReport(dr),
                        dr_qe_owner_name = sa.GetEmployeeNameLangString(qeOwner, GetLang()),
                        dr_me_owner_name = sa.GetEmployeeNameLangString(meOwner, GetLang()),
                        dr_num = dr.dr_num
                    });
                }
            }
            catch
            {
                return DirectFailure("Call Login CreateDR failed!");
            }
        }


        [DirectInclude]
        public ActionResult GetDrTypes()
        {

            return this.Direct(new
            {
                data = QdtCommonString.GetCommonStringsByCategory1("dr_type")
            });
        }


        [DirectInclude]
        public ActionResult GetDispositionTypes()
        {
            return this.Direct(new
            {
                data = QdtCommonString.GetCommonStringsByCategory1("disp_type")
            });
        }

        [DirectInclude]
        public ActionResult GetActionTypes()
        {
            return this.Direct(new
            {
                data = QdtCommonString.GetCommonStringsByCategory1("act_type")
            });
        }


        [DirectInclude]
        public ActionResult GetUnfinishedActionOwners(string drNum)
        {
            try
            {
                string sApproved = QdtAction.ActionStatuses[QdtAction.ActionStatus.Approved];
                var unfinishedActions = qdtEntities.qdt_action.Where(n => n.dr_num == drNum && n.status == sApproved);

                List<string> actionOwners = new List<string>();
                if (GetLang().Equals("cn"))
                {
                    foreach (qdt_action action in unfinishedActions)
                    {
                        actionOwners.Add((new HrEmployee(hrEntities.hr_employee.Single(n => n.employee_id == action.act_owner))).employee.name_cn);
                    }
                }
                else
                {
                    foreach (qdt_action action in unfinishedActions)
                    {
                        actionOwners.Add((new HrEmployee(hrEntities.hr_employee.Single(n => n.employee_id == action.act_owner))).employee.name_en);
                    }
                }
                return this.Direct(new
                {
                    success = true,
                    actionOwners = actionOwners.Distinct()
                });
            }
            catch
            {
                return DirectFailure("Call Login GetUnfinishedActionOwners Failed!");
            }
        }

        [DirectInclude]
        public ActionResult GetDrSources()
        {
            return this.Direct(new
            {
                data = QdtCommonString.GetCommonStringsByCategory1("dr_source")
            });
        }


        [DirectInclude]
        public ActionResult SearchDispositionReasons(JObject o)
        {
            string query = o["query"].Value<String>();
            //区分大小写
            // List<QdtCommonString> dispositionReasons = GetComStrings("disp_reason").Where(n => n.qdtComString.cn_string.Contains(query)
            //                                                                                 || n.qdtComString.en_string.Contains(query)).ToList();

            List<qdt_com_string> qdtDispositionReasons = qdtEntities.qdtGetDispositionReasonsSP(query).ToList();
            List<QdtCommonString> dispositionReasons = new List<QdtCommonString>();
            foreach (var reason in qdtDispositionReasons)
            {
                dispositionReasons.Add(new QdtCommonString(reason));
            }
            return this.Direct(new
            {
                data = PagedData(o, dispositionReasons.AsQueryable()),
                total = dispositionReasons.Count()
            });
        }

        [DirectInclude]
        public ActionResult GetDiscrepancyByDrNumber(string drNum)
        {
            var discrepancies = qdtEntities.qdt_discrepancy.Where(n => n.dr_num == drNum).ToList();
            return this.DirectSuccess(discrepancies);
        }


        #endregion

        #region Disposition

        [DirectInclude]
        public ActionResult GetResponsibleDepartments()
        {
            return this.Direct(new
            {
                data = QdtCommonString.GetCommonStringsByCategory1("responsible_department")
            });
        }

        [DirectInclude]
        public ActionResult GetDispositionByDrNumber(string drNum)
        {
            try
            {
                List<qdt_disposition> dispositionList = qdtEntities.qdt_disposition.Where(n => n.dr_num == drNum).ToList();
                List<QdtDisposition> qdtDispositions = new List<QdtDisposition>();

                foreach (var dispisition in dispositionList)
                {
                    QdtDisposition qdtDisposition = new QdtDisposition(dispisition);
                    qdtDisposition.InitialProperties();
                    qdtDispositions.Add(qdtDisposition);
                }

                return this.Direct(new
                {
                    data = qdtDispositions
                });
            }
            catch
            {
                return DirectFailure("Call Login GetDispositionByDrNumber Failed!");
            }
        }


        [DirectInclude]
        public ActionResult DeleteDisposition(int dispId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var disposition = db.qdt_disposition.Single(n => n.disp_id == dispId);
                var dr = db.qdt_dr.Single(n => n.dr_num.Equals(disposition.dr_num));
                //判断是不是dr的me，并且disposition的状态是create或者open的时候    
                if (dr.dr_me_owner == VmNativeUser.GetEmployeeIdByUserId(GetCurrentUser().user_id) &&
                    (disposition.status.Equals(DispositionStatus.Open.ToLowerString()) ||
                    disposition.status.Equals(DispositionStatus.Create.ToLowerString())))
                {

                    db.qdtDeleteDispositionSP(dispId);
                    return this.DirectSuccess();
                }
                return this.DirectFailure("删除disposition失败");
            }

        }


        [DirectInclude]
        [FormHandler]
        public ActionResult UpdateDisposition()
        {
            var form = Request.Form;

            int dispId = Convert.ToInt32(form["disp_id"]);
            var disposition = qdtEntities.qdt_disposition.Single(n => n.disp_id == dispId);

            disposition.reason = Convert.ToInt32(form["reasonType.qdtComString." + GetLang() + "_string"]);
            disposition.responsible_department =
                Convert.ToInt32(form["responsibleDepartment.qdtComString." + GetLang() + "_string"]);
            disposition.disp_type = Convert.ToInt32(form["dispType.qdtComString." + GetLang() + "_string"]);
            disposition.description = form["disposition.description"];

            disposition.update_by = GetCurrentUser().user_id;
            disposition.update_date = DateTime.Now;



            //var discDisps = qdtEntities.qdt_disc_disp.Where(n => n.disp_id == dispId);
            //foreach (var discDisp in discDisps)
            //{
            //    qdtEntities.qdt_disc_disp.DeleteObject(discDisp);
            //}


            //foreach (var key in form.AllKeys.Where(n => n.Contains("discrepancy_list#")))
            //{
            //    if (!form[key].Equals("off"))
            //    {
            //        var relation = new qdt_disc_disp()
            //        {
            //            disp_id = disposition.disp_id,
            //            disc_id = Convert.ToInt32(form[key])
            //        };
            //        qdtEntities.qdt_disc_disp.AddObject(relation);
            //    }
            //}

            qdtEntities.SaveChanges();
            return this.Direct(new
            {
                success = true,
                data = disposition
            });
        }

        [DirectInclude]
        [FormHandler]
        public ActionResult CreateDisposition()
        {
            try
            {
                var form = Request.Form;


                string drNum = form["disposition.dr_num"];
                int? dispRank = qdtEntities.qdt_disposition.Where(n => n.dr_num == drNum).Max(n => n.disp_rank);
                dispRank = dispRank == null ? 1 : (dispRank + 1);
                qdt_disposition disposition = new qdt_disposition()
                {
                    disp_rank = dispRank,
                    dr_num = drNum,
                    reason = Convert.ToInt32(form["reasonType.qdtComString." + GetLang() + "_string"]),
                    responsible_department = Convert.ToInt32(form["responsibleDepartment.qdtComString." + GetLang() + "_string"]),
                    disp_type = Convert.ToInt32(form["dispType.qdtComString." + GetLang() + "_string"]),
                    description = form["disposition.description"],
                    create_by = GetCurrentUser().user_id,
                    create_date = DateTime.Now,
                    update_by = GetCurrentUser().user_id,
                    update_date = DateTime.Now,
                    status = QdtDisposition.DispositionStatuses[DispositionStatus.Create]
                };

                // qdt_disposition disposition = db.qdtCreateDispositionSP(dr_num, reason, disp_type, description, create_by, create_by).Single();

                qdtEntities.qdt_disposition.AddObject(disposition);
                qdtEntities.SaveChanges();


                foreach (var key in form.AllKeys.Where(n => n.Contains("discrepancy_list#")))
                {
                    if (!form[key].Equals("off"))
                    {
                        var relation = new qdt_disc_disp()
                        {
                            disp_id = disposition.disp_id,
                            disc_id = Convert.ToInt32(form[key])
                        };
                        qdtEntities.qdt_disc_disp.AddObject(relation);
                    }
                }
                qdtEntities.SaveChanges();

                return this.Direct(new
                {
                    success = true,
                    data = disposition
                });
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        public ActionResult FinishDispose(string drNum, int dispId)
        {
            try
            {
                UpdateDispositionStatus(dispId, QdtDisposition.DispositionStatuses[DispositionStatus.Open]);
                var disposition = qdtEntities.qdt_disposition.Single(n => n.disp_id == dispId);
                if (!IsPendingAction(drNum))
                {
                    UpdateDrStatus(disposition.dr_num, QdtDiscrepancyReport.DrStatuses[DrStatus.PendingQEME]);
                }
                SendNotification(EmailType.QdtDispositionCreated, dispId);
            }
            catch
            {
                return DirectFailure("Call method DinishDispose Failed!");
            }

            return DirectSuccess();
        }

        [DirectInclude]
        public ActionResult ApproveDisposition(string drNum, int dispId)
        {
            try
            {
                UpdateDispositionStatus(dispId, QdtDisposition.DispositionStatuses[DispositionStatus.Running]);
                UpdateDrStatus(drNum, QdtDiscrepancyReport.DrStatuses[DrStatus.PendingAction]);
            }
            catch
            {
                return DirectFailure("Call Login ApproveDisposition Failed!");
            }

            return DirectSuccess();
        }

        [DirectInclude]
        public ActionResult RejectDisposition(string drNum, int disp_id)
        {
            try
            {
                UpdateDispositionStatus(disp_id, QdtDisposition.DispositionStatuses[DispositionStatus.Reject]);
                string sReject = QdtDisposition.DispositionStatuses[DispositionStatus.Reject];
                string sFailure = QdtDisposition.DispositionStatuses[DispositionStatus.Failure];
                string sCreate = QdtDisposition.DispositionStatuses[DispositionStatus.Create];
                int goodDispositionCount = qdtEntities.qdt_disposition.Where(n => n.dr_num == drNum && n.status != sReject && n.status != sFailure && n.status != sCreate).Count();
                if (goodDispositionCount == 0 && !IsPendingAction(drNum))
                {
                    UpdateDrStatus(drNum, QdtDiscrepancyReport.DrStatuses[DrStatus.PendingME]);
                }
            }
            catch
            {
                return DirectFailure("Call Login RejectDisposition Failed!");
            }
            return DirectSuccess();
        }


        [DirectInclude]
        public ActionResult AcceptDispositionResult(string drNum, int disp_id)
        {
            try
            {
                UpdateDispositionStatus(disp_id, QdtDisposition.DispositionStatuses[DispositionStatus.Success]);
                if (!IsPendingAction(drNum))
                {
                    UpdateDrStatus(drNum, QdtDiscrepancyReport.DrStatuses[DrStatus.PendingQEME]);
                }
            }
            catch
            {
                return DirectFailure("Call Login AcceptDispositionResult Failed!");
            }

            return DirectSuccess();
        }

        [DirectInclude]
        public ActionResult RejectDispositionResult(string drNum, int disp_id)
        {
            try
            {
                UpdateDispositionStatus(disp_id, QdtDisposition.DispositionStatuses[DispositionStatus.Failure]);
                string sReject = QdtDisposition.DispositionStatuses[DispositionStatus.Reject];
                string sFailure = QdtDisposition.DispositionStatuses[DispositionStatus.Failure];
                string sCreate = QdtDisposition.DispositionStatuses[DispositionStatus.Create];
                int goodDispositionCount = qdtEntities.qdt_disposition.Where(n => n.dr_num == drNum && n.status != sReject && n.status != sFailure && n.status != sCreate).Count();
                if (goodDispositionCount == 0 && !IsPendingAction(drNum))
                {
                    UpdateDrStatus(drNum, QdtDiscrepancyReport.DrStatuses[DrStatus.PendingME]);
                }
            }
            catch
            {
                return DirectFailure("Call Login RejectDispositionResult Failed!");
            }
            return DirectSuccess();
        }

        #endregion

        #region Action

        [DirectInclude]
        public ActionResult DeleteAction(int actId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var action = db.qdt_action.Single(n => n.act_id == actId);
                var dr = db.qdt_dr.Single(n => n.dr_num == action.dr_num);
                var disposition = db.qdt_disposition.Single(n => n.disp_id == action.disp_id);
                //判断是不是dr的me，并且action的状态是open,并且disposition的状态时create的时候
                //也就是说一旦ME完成部署，那么就不能更改或者删除了
                if (dr.dr_me_owner == VmNativeUser.GetEmployeeIdByUserId(GetCurrentUser().user_id) &&
                    action.status.Equals(ActionStatus.Open.ToLowerString()) &&
                    disposition.status.Equals(Models.Dr.DispositionStatus.Create.ToLowerString()))
                {
                    db.qdtDeleteActionSP(actId);
                    return this.DirectSuccess();
                }

            }

            return this.DirectFailure("删除Action失败！");
        }


        [DirectInclude]
        [FormHandler]
        public ActionResult UpdateAction()
        {

            var form = Request.Form;
            var actionId = Convert.ToInt32(form["action.act_id"]);
            var action = qdtEntities.qdt_action.Single(n => n.act_id == actionId);

            action.act_type = Convert.ToInt32(form["actionType.qdtComString." + GetLang() + "_string"]);
            action.act_owner = Convert.ToInt32(form["owner.employee.name_" + GetLang()]);
            action.description = form["action.description"];
            action.st_action = form["action.st_action"];
            action.lt_action = form["action.lt_action"];
            action.ct_action = form["action.ct_action"];
            action.due_date = DateTime.Parse(form["action.due_date"]);

            action.update_by = GetCurrentUser().user_id;
            action.update_date = DateTime.Now;


            //var discActs = qdtEntities.qdt_disc_act.Where(n => n.act_id == actionId);
            //foreach (var discAct in discActs)
            //{
            //    qdtEntities.qdt_disc_act.DeleteObject(discAct);
            //}


            //foreach (var key in form.AllKeys.Where(n => n.Contains("discrepancy_list#")))
            //{
            //    if (!form[key].Equals("off"))
            //    {
            //        var relation = new qdt_disc_act()
            //        {
            //            act_id = action.act_id,
            //            disc_id = Convert.ToInt32(form[key])
            //        };
            //        qdtEntities.qdt_disc_act.AddObject(relation);
            //    }
            //}
            qdtEntities.SaveChanges();

            return this.Direct(new
            {
                success = true,
                data = action
            });


        }


        [DirectInclude]
        [FormHandler]
        public ActionResult CreateAction()
        {
            try
            {
                var form = Request.Form;
                var dispId = Convert.ToInt32(form["action.disp_id"]);
                string drNum = qdtEntities.qdt_disposition.Single(n => n.disp_id == dispId).dr_num;
                qdt_action action = new qdt_action()
                {
                    act_type = Convert.ToInt32(form["actionType.qdtComString." + GetLang() + "_string"]),
                    act_owner = Convert.ToInt32(form["owner.employee.name_" + GetLang()]),
                    description = form["action.description"],
                    st_action = form["action.st_action"],
                    lt_action = form["action.lt_action"],
                    ct_action = form["action.ct_action"],
                    due_date = DateTime.Parse(form["action.due_date"]),
                    dr_num = drNum,
                    disp_id = dispId,
                    create_by = GetCurrentUser().user_id,
                    create_date = DateTime.Now,
                    update_by = GetCurrentUser().user_id,
                    update_date = DateTime.Now,
                    status = QdtAction.ActionStatuses[QdtAction.ActionStatus.Open]
                };
                //string st_action = form["st_action"],
                //    lt_action = form["lt_action"],
                //    ct_action = form["ct_action"],
                //    description = form["description"];
                //int disp_id = Convert.ToInt32(form["disp_id"]),
                //    act_type = Convert.ToInt32(form["act_type"]),
                //    act_owner = Convert.ToInt32(form["act_owner"]);
                //DateTime due_date = DateTime.Parse(form["due_date"]);
                //int create_by = GetCurrentUser().user_id;
                // var db = new QDTEntities();
                //  qdt_action action = db.qdtCreateActionSP(disp_id, act_type, act_owner, description, st_action, lt_action, ct_action, due_date, create_by, create_by).Single();

                qdtEntities.qdt_action.AddObject(action);
                qdtEntities.SaveChanges();

                SendNotification(EmailType.QdtActionCreated, action.act_id);

                foreach (var key in form.AllKeys.Where(n => n.Contains("discrepancy_list#")))
                {
                    if (!form[key].Equals("off"))
                    {
                        var relation = new qdt_disc_act()
                        {
                            act_id = action.act_id,
                            disc_id = Convert.ToInt32(form[key])
                        };
                        qdtEntities.qdt_disc_act.AddObject(relation);
                    }
                }
                qdtEntities.SaveChanges();

                return this.Direct(new
                {
                    success = true,
                    data = action
                });
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        [FormHandler]
        public ActionResult UpdateActionRemark()
        {
            try
            {
                var form = Request.Form;
                string remark = form["action.remark"];
                int actId = Convert.ToInt32(form["action.act_id"]);
                qdt_action updateAction = qdtEntities.qdtUpdateActionRemarkSP(actId, remark).Single();


                string fileLocation = "/qdtActionAttachments/";

                int attachmentCount = 1;
                foreach (string f in Request.Files)
                {
                    HttpPostedFileBase file = Request.Files[f];
                    if (file != null && file.ContentLength > 0)
                    {

                        // string path = @"\\TNWD07986\dr\"; 
                        string path = Server.MapPath(fileLocation);  //map to the server path

                        string fileName = actId + "_" +
                                          file.FileName.Substring(file.FileName.LastIndexOf('\\') + 1, file.FileName.LastIndexOf('.') - file.FileName.LastIndexOf('\\') - 1) + "_" +
                                          DateTime.Now.Year + "_" +
                                          DateTime.Now.Month + "_" +
                                          DateTime.Now.Day + "_" +
                                          attachmentCount++ + "." +
                                          file.FileName.Split('.')[file.FileName.Split('.').Length - 1];   //TODO: fileName hard coding
                        try
                        {
                            SystemAdminController.AddAttachment("action", actId.ToString(), path + fileName, GetCurrentUser().user_id);
                            file.SaveAs(path + fileName);//保存文件
                            //      SystemAdminController.AddAttachment("dr",dr_num,path+fileName,GetCurrentUser().user_id);
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


                //TODO: send notification for action update
                return this.Direct(new
                {
                    success = true,
                    data = updateAction
                });
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        public ActionResult GetDispositionAction(int dispId)
        {
            return this.Direct(new
            {
                data = qdtEntities.qdt_action.Where(n => n.disp_id == dispId).ToList()
            });
        }

        [DirectInclude]
        public ActionResult GetEmployeesInfo(JObject o)
        {
            var query = o.GetString("query");
            List<hr_employee> employeesInfo = new SuzhouHrEntities().hrGetEmployeesInfoSP(query).ToList();
            List<HrEmployee> hrEmployees = new List<HrEmployee>();
            foreach (var employee in employeesInfo)
            {
                hrEmployees.Add(new HrEmployee(employee));
            }

            return this.Direct(new
            {
                success = true,
                data = PagedData(o, hrEmployees.AsQueryable()),
                total = hrEmployees.Count()
            });
        }


        [DirectInclude]
        public ActionResult GetAuthorizedMes(JObject o)
        {
            try
            {
                string query = o["query"].Value<String>().ToUpper();
                var data = qdtEntities.qdtAuthorizedMeViews.ToList();
                using (SuzhouHrEntities db = new SuzhouHrEntities())
                {

                    List<hr_employee> employeesInfo = (from e in db.hr_employee.ToList()
                                                       join d in data on e.sso equals d.sso
                                                       where e.name_en.ToUpper().Contains(query) ||
                                                       e.sso.ToUpper().Contains(query) ||
                                                       e.name_cn.ToUpper().Contains(query)
                                                       select e).ToList<hr_employee>();

                    List<HrEmployee> hrEmployees = new List<HrEmployee>();
                    foreach (var employee in employeesInfo)
                    {
                        hrEmployees.Add(new HrEmployee(employee));
                    }

                    return this.Direct(new
                    {
                        success = true,
                        data = PagedData(o, hrEmployees.AsQueryable()),
                        total = hrEmployees.Count()
                    });
                }
            }
            catch
            {
                return DirectFailure("Call Method QDTController GetAuthorizedMes Failed!");
            }

        }


        [DirectInclude]
        public ActionResult GetUsersInfo(JObject o)
        {
            var usersInfo = systemAdminEntities.sysGetUsersInfoSP(o["query"].Value<String>()).ToList();
            List<User> users = new List<User>();
            foreach (var user in usersInfo)
            {
                users.Add(new User(user, GetLang()));
            }

            return this.Direct(new
            {
                success = true,
                data = PagedData(o, users.AsQueryable()),
                total = users.Count()
            });
        }

        #endregion

        //TODO: move this method to PMBController
        [DirectInclude]
        public ActionResult QueryJobOrders(JObject o)
        {
            using (PmbEntities db = new PmbEntities())
            {
                var jobs = db.pmbQueryJobOrder(o["query"].Value<String>(), "J").Where(n => n.suffix == 0).Distinct().ToList().AsQueryable();


                //Where suffix==0 to filter some duplicate data (for examle, for job M000009723, suffix can be 0 and 1,
                //This assume if a job can with a suffix 1, it must have a record with suffix equals to 0
                return this.Direct(new
                {
                    data = PagedData(o, jobs),
                    total = jobs.Count()
                });
                //return this.Direct(new
                //{
                //    data = PagedData(o, jobs).ToList().Add(new PmbJobOrder()
                //    {
                //       job="N/A",
                //       suffix = 0,
                //       item = "",
                //       serial = "",
                //       lot = ""
                //    }),
                //    total = jobs.Count()
                //});
            }

        }


        [DirectInclude]
        public ActionResult SearchItems(JObject o)
        {
            var items = qdtEntities.qdtGetItemsSP(o["query"].Value<String>()).ToList().AsQueryable();
            return this.Direct(new
            {
                data = PagedData(o, items),
                total = items.Count()

            });
        }

        //TODO: move to PMBController
        [DirectInclude]
        public ActionResult GetJobReleasedQuantity(string job, int suffix)
        {
            try
            {

                return this.Direct(new
                {
                    //TODO: SP name need to be changed
                    data = qdtEntities.qdtGetJobReleasedQuantitySP(job, suffix).Single().Value,
                    success = true
                });
            }
            catch
            {
                return DirectFailure();
            }
        }


        [DirectInclude]
        public ActionResult GetDiscrepancyiesByDrNumber(string drNum)
        {
            List<qdt_discrepancy> discrepancies = new List<qdt_discrepancy>();
            try
            {
                discrepancies = qdtEntities.qdt_discrepancy.Where(n => n.dr_num == drNum).ToList();
            }
            catch
            {
                return DirectFailure("Call Login GetDiscrepancyiesByDrNumber Failed!");
            }

            return DirectSuccess(discrepancies);
        }

        [DirectInclude]
        public ActionResult GetDiscrepanciesByDispositionId(int dispId)
        {
            return this.Direct(new
            {
                data = qdtEntities.qdtGetDiscrepanciesByDispSP(dispId).ToList()
            });
        }


        [DirectInclude]
        public ActionResult GetDrByDrNumber(string drNum)
        {
            QdtDiscrepancyReport dr = new QdtDiscrepancyReport(qdtEntities.qdt_dr.Where(n => n.dr_num == drNum).Single());
            dr.InitialProperties();
            return this.Direct(new
            {
                data = dr,
                success = true
            }
            );
        }


        [DirectInclude]
        public ActionResult GetDiscrepanciesByActionId(int actId)
        {
            return this.Direct(new
            {
                data = qdtEntities.qdtGetDiscrepanciesByActSP(actId).ToList()
            });
        }


        [DirectInclude]
        public ActionResult UpdateDispositionStatus(int dispId, string status)
        {
            qdt_disposition disposition = qdtEntities.qdt_disposition.Where(n => n.disp_id == dispId).Single();

            if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Open])
                && disposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Create]))
            {
                disposition.status = status;
                //TODO, 通知QE处理disposition SendNotification(EmailType.QdtDispositionReviewed, disp_id);
            }

            if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Running])
                && disposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Open]))
            {
                disposition.status = status;
                SendNotification(EmailType.QdtDispositionReviewed, dispId);
            }
            else if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Reject])
                && disposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Open]))
            {
                disposition.status = status;
                SendNotification(EmailType.QdtDispositionRejected, dispId);
            }
            else if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Completed])
                && disposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Running]))
            {
                disposition.status = status;
            }
            else if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Success])
                && disposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Completed]))
            {
                disposition.status = status;
                SendNotification(EmailType.QdtDispositionReviewed, dispId);
            }
            else if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Failure])
                && disposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Completed]))
            {
                disposition.status = status;
                SendNotification(EmailType.QdtDispositionReviewed, dispId);
            }
            else if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Open]))
            {
                disposition.status = QdtDisposition.DispositionStatuses[DispositionStatus.Open];
            }
            //else
            //{
            //    disposition.status = QdtDisposition.DispositionStatuses[QdtDisposition.DispositionStatus.Open];
            //}

            disposition.update_by = GetCurrentUser().user_id;
            disposition.update_date = DateTime.Now;
            qdtEntities.SaveChanges();
            // qdt.qdtUpdateDispositionStatusSP(GetCurrentUser().user_id, disp_id, status);

            if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Running]))
            {
                List<qdtGetActionListSP_Result> actions = qdtEntities.qdtGetActionListSP(dispId, GetLang()).ToList();
                string approved = QdtAction.ActionStatuses[QdtAction.ActionStatus.Approved];
                foreach (qdtGetActionListSP_Result action in actions)
                {
                    UpdateActionStatus(action.act_id, approved);
                    SendNotification(EmailType.QdtActionReleased, action.act_id);

                }
            }

            else if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Reject]))
            {
                List<qdtGetActionListSP_Result> actions = qdtEntities.qdtGetActionListSP(dispId, GetLang()).ToList();
                foreach (qdtGetActionListSP_Result action in actions)
                {
                    if (action.status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Open]))
                    {
                        UpdateActionStatus(action.act_id, QdtAction.ActionStatuses[QdtAction.ActionStatus.Reject]);
                    }
                }
            }

            else if (status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Failure])
                || status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Success]))
            {
                List<qdtGetActionListSP_Result> actions = qdtEntities.qdtGetActionListSP(dispId, GetLang()).ToList();

                foreach (qdtGetActionListSP_Result action in actions)
                {
                    UpdateActionStatus(action.act_id, QdtAction.ActionStatuses[QdtAction.ActionStatus.Reviewed]);
                }
            }

            return DirectSuccess();
        }

        public List<qdtGetActionListSP_Result> qdtGetActionList(int disp_id)
        {
            return qdtEntities.qdtGetActionListSP(disp_id, GetLang()).ToList();
        }
        [DirectInclude]
        public ActionResult getActionsByDisposition(int disp_id)
        {
            List<qdt_action> actionList = qdtEntities.qdt_action.Where(n => n.disp_id == disp_id).ToList();
            List<QdtAction> actions = new List<QdtAction>();

            foreach (qdt_action action in actionList)
            {
                QdtAction qdtAction = new QdtAction(action);
                qdtAction.InitialProperties();
                actions.Add(qdtAction);
            }

            return this.Direct(new
            {
                data = actions
            });

        }



        [DirectInclude]
        public ActionResult UpdateActionStatus(int act_id, string status)
        {
            Boolean allCompleted = false;   //disposition下所有的action都完成的标志
            qdt_action action = qdtEntities.qdt_action.Where(n => n.act_id == act_id).Single();

            if (status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Approved])
                && action.status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Open]))
            {
                action.update_by = GetCurrentUser().user_id;
                action.update_date = DateTime.Now;
                action.status = status;
            }
            else if (status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Reject])
                && action.status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Open]))
            {
                action.update_by = GetCurrentUser().user_id;
                action.update_date = DateTime.Now;
                action.status = status;
            }
            else if (status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Completed])
                && action.status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Approved]))
            {
                action.update_by = GetCurrentUser().user_id;
                action.update_date = DateTime.Now;
                action.status = status;

                List<qdt_action> actions = qdtEntities.qdt_action.Where(n => n.disp_id == action.disp_id).ToList();

                allCompleted = actions.Count(n => n.disp_id == action.disp_id
                   && n.status != QdtAction.ActionStatuses[QdtAction.ActionStatus.Completed]
                   && n.status != QdtAction.ActionStatuses[QdtAction.ActionStatus.Reviewed]
                   && n.status != QdtAction.ActionStatuses[QdtAction.ActionStatus.Reject]) == 0;

                if (allCompleted)
                {
                    UpdateDispositionStatus(action.disp_id, QdtDisposition.DispositionStatuses[DispositionStatus.Completed]);
                    SendNotification(EmailType.QdtActionAllCompleted, action.disp_id);
                }
            }
            else if (status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Reviewed])
                && action.status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Completed]))
            {
                action.update_by = GetCurrentUser().user_id;
                action.update_date = DateTime.Now;
                action.status = status;
            }

            qdtEntities.SaveChanges();





            //若此DR下面没有处于open 和 approved状态的action，并且有completed的action    更新DR的状态 为Pending QEME
            var allActions = qdtEntities.qdt_action.Where(n => n.dr_num == action.dr_num);
            int openCount = 0;
            int approvedCount = 0;
            int completedCount = 0;
            foreach (qdt_action a in allActions)
            {
                if (a.status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Open]))
                {
                    openCount++;
                }
                else if (a.status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Approved]))
                {
                    approvedCount++;
                }
                else if (a.status.Equals(QdtAction.ActionStatuses[QdtAction.ActionStatus.Completed]))
                {
                    completedCount++;
                }
            }
            if (openCount == 0 && approvedCount == 0 && completedCount > 0)
            {
                UpdateDrStatus(action.dr_num, QdtDiscrepancyReport.DrStatuses[DrStatus.PendingQEME]);
            }



            return this.Direct(new
            {
                allCompleted = allCompleted,
                success = true
            });
        }


        private ActionResult UpdateDrStatus(string drNum, string status)
        {
            try
            {
                var dr = qdtEntities.qdt_dr.Single(n => n.dr_num == drNum);
                dr.status = status;
                qdtEntities.SaveChanges();
            }
            catch
            {
                return DirectFailure("Call function UpdateDrStatus failed");
            }
            return DirectSuccess();
        }

        /// <summary>
        /// Send notifiaction to receipts according to notification type
        /// </summary>
        /// <param name="emailType">The notification type</param>
        /// <param name="arg">Reference to create email model, e.g. dr_num, act_id etc.</param>
        private void SendNotification(EmailType emailType, object arg)
        {
            dynamic model = null;
            var receivers = new List<string>();
            switch (emailType)
            {
                case EmailType.QdtNewDiscrepancyReport:
                    {
                        var drNum = arg.ToString();
                        var dr = new QdtDiscrepancyReport(new QDTEntities().qdt_dr.Single(n => n.dr_num == drNum));
                        dr.InitialProperties();
                        receivers.Add(dr.qeOwner.employee.email);
                        receivers.Add(dr.meOwner.employee.email);

                        var familyCode = dr.item.item.family_code;
                        if (familyCode.Equals("M") || familyCode.Equals("MA") || familyCode.Equals("MR"))
                        {
                            receivers.Add("Yanxia.Yu@ge.com");
                        }

                        model = dr;
                        break;
                    }
                case EmailType.QdtDispositionCreated:
                    {
                        var dispId = Convert.ToInt32(arg.ToString());
                        var disposition = new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == dispId));
                        disposition.InitialProperties();
                        disposition.dr.InitialProperties();
                        receivers.Add(disposition.dr.qeOwner.employee.email);
                        model = disposition;
                        break;
                    }
                //case EmailType.QdtActionCreated:
                //    {
                //        var act_id = Convert.ToInt32(arg);
                //        var action = new QdtAction(new QDTEntities().qdt_action.Single(n => n.act_id == act_id));
                //        action.InitialProperties();
                //        action.dr.InitialProperties();
                //        receivers.Add(action.dr.qeOwner.employee.email);
                //        model = action;
                //        break;
                //    }
                case EmailType.QdtActionReleased:
                    {
                        var actId = Convert.ToInt32(arg);
                        var action = new QdtAction(new QDTEntities().qdt_action.Single(n => n.act_id == actId));
                        action.InitialProperties();
                        action.dr.InitialProperties();
                        receivers.Add(action.owner.employee.email);
                        model = action;
                        break;
                    }
                case EmailType.QdtActionUpdated:
                    {
                        var actId = Convert.ToInt32(arg);
                        var action = new QdtAction(new QDTEntities().qdt_action.Single(n => n.act_id == actId));
                        action.InitialProperties();
                        action.dr.InitialProperties();
                        receivers.Add(action.dr.qeOwner.employee.email);
                        model = action;
                        break;
                    }
                case EmailType.QdtActionAllCompleted:
                    {
                        var dispId = Convert.ToInt32(arg);
                        var disposition = new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == dispId));
                        disposition.InitialProperties();
                        disposition.dr.InitialProperties();
                        receivers.Add(disposition.dr.qeOwner.employee.email);
                        receivers.Add(disposition.dr.meOwner.employee.email);
                        model = disposition;
                        break;
                    }
                case EmailType.QdtDispositionReviewed:
                    {
                        var disp_id = Convert.ToInt32(arg);
                        var disposition = new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == disp_id));
                        disposition.InitialProperties();
                        disposition.dr.InitialProperties();
                        receivers.Add(disposition.dr.meOwner.employee.email);
                        model = disposition;
                        break;
                    }
                case EmailType.QdtDispositionRejected:
                    {
                        var dispId = Convert.ToInt32(arg);
                        var disposition = new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == dispId));
                        disposition.InitialProperties();
                        disposition.dr.InitialProperties();
                        receivers.Add(disposition.dr.meOwner.employee.email);
                        model = disposition;
                        break;
                    }
                case EmailType.QdtDiscrepancyReportClosed:
                    {
                        var drNum = arg.ToString();
                        var dr = new QdtDiscrepancyReport(new QDTEntities().qdt_dr.Single(n => n.dr_num == drNum));
                        dr.InitialProperties();
                        receivers.Add(dr.qeOwner.employee.email);
                        receivers.Add(dr.meOwner.employee.email);
                        model = dr;
                        break;
                    }
                default: break;
            }
            //string receiverAddresses = string.Join(";", receivers.RemoveAll(n => n.Equals(string.Empty)));
            //string receiverAddresses = string.Join(";", receivers);
            Thread sendMailsThread = new Thread(() => SendMails(receivers, emailType, model));
            sendMailsThread.Start();
            //foreach (string receiver in receivers)
            //{
            //    HtmlMailController.SendMail(Email.GetSuzhouAutoMailClient(), receiver, HtmlMailController.MailSubject[emailType], HtmlMailController.GetMailBody(emailType, model));
            //}
        }

        protected void SendMails(List<string> receivers, EmailType emailType, dynamic model)
        {
            foreach (string receiver in receivers)
            {
                HtmlMailController.SendMail(Email.GetSuzhouAutoMailClient(), receiver, HtmlMailController.MailSubject[emailType], HtmlMailController.GetMailBody(emailType, model));
            }
        }

        [DirectInclude]
        public ActionResult IsActionOwner(int actId)
        {
            int actionOwnerEmployeeId = (int)qdtEntities.qdt_action.Where(n => n.act_id == actId).Single().act_owner;
            SuzhouHrEntities employees = new SuzhouHrEntities();
            string actionOwnerSso = (string)employees.hr_employee.Where(n => n.employee_id == actionOwnerEmployeeId).Single().sso;
            SystemAdminEntities users = new SystemAdminEntities();
            int actionOwnerUserId = (int)users.sys_user.Where(n => n.sso == actionOwnerSso).Single().user_id;
            Boolean isActionOwner = false;
            if (GetCurrentUser().user_id == actionOwnerUserId)
            {
                isActionOwner = true;
            }
            return this.Direct(new
            {
                isActionOwner = isActionOwner,
                success = true
            });
        }

        [DirectInclude]
        public ActionResult GetUserTypeByDrNumber(string drNum)
        {
            int qeOwnerEmployeeId = (int)qdtEntities.qdt_dr.Single(n => n.dr_num == drNum).dr_qe_owner;
            int meOwnerEmployeeId = (int)qdtEntities.qdt_dr.Single(n => n.dr_num == drNum).dr_me_owner;

            SuzhouHrEntities employees = new SuzhouHrEntities();
            string qeOwnerSso = (string)employees.hr_employee.Single(n => n.employee_id == qeOwnerEmployeeId).sso;
            string meOwnerSso = (string)employees.hr_employee.Single(n => n.employee_id == meOwnerEmployeeId).sso;
            SystemAdminEntities users = new SystemAdminEntities();
            int qeOwnerUserId = (int)users.sys_user.Single(n => n.sso == qeOwnerSso).user_id;
            int meOwnerUserId = users.sys_user.Single(n => n.sso == meOwnerSso).user_id;

            Boolean isQeOwner = false;
            Boolean isMeOwner = false;


            try
            {
                if (GetCurrentUser().user_id == qeOwnerUserId)
                {
                    isQeOwner = true;
                }
                if (GetCurrentUser().user_id == meOwnerUserId)
                {
                    isMeOwner = true;
                }
            }
            catch
            {
                DirectTimeout("GetUserTypeByDrNumber");
            }

            return this.Direct(new
            {
                isQeOwner = isQeOwner,
                isMeOwner = isMeOwner,
                success = true
            });
        }

        //private int GetUserIdByEmployeeId(int employee_id)
        //{
        //    SuzhouHrEntities employees = new SuzhouHrEntities();
        //    string me_owner_sso = (string)employees.hr_employee.Where(n => n.employee_id == employee_id).Single().sso;
        //    SystemAdminEntities users = new SystemAdminEntities();
        //    return (int)users.sys_user.Where(n => n.sso == me_owner_sso).Single().user_id;
        //}



        //private int GetEmployeeIdByUserId(int user_id)
        //{
        //    SystemAdminEntities users = new SystemAdminEntities();
        //    string sso = (string)users.sys_user.Where(n => n.user_id == user_id).Single().sso;
        //    SuzhouHrEntities employees = new SuzhouHrEntities();
        //    return employees.hr_employee.Where(n => n.sso == sso).Single().employee_id;
        //}

        [DirectInclude]
        public ActionResult GetActionsByDispositionId(int disp_id)
        {
            int act_owner = SystemAdminController.GetEmployeeIdByUserId(GetCurrentUser().user_id);
            List<qdt_action> actions = qdtEntities.qdt_action.Where(n => n.disp_id == disp_id && n.act_owner == act_owner).ToList();
            List<int> ids = new List<int>();
            foreach (qdt_action action in actions)
            {
                ids.Add(action.act_id);
            }

            bool canDispose = false;
            var selectedDisposition = qdtEntities.qdt_disposition.Single(n => n.disp_id == disp_id);

            if (selectedDisposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Create]) ||
                selectedDisposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Open]))
            {
                canDispose = true;
            }

            return this.Direct(new
            {
                data = ids,
                canDispose = canDispose,
                success = true
            });
        }


        /// <summary>
        /// 
        /// </summary>
        /// <param name="dr_num"></param>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult CheckDispositionAndActionStatus(string dr_num)
        {
            string sDispSuccess = QdtDisposition.DispositionStatuses[DispositionStatus.Success];
            string sDispFailure = QdtDisposition.DispositionStatuses[DispositionStatus.Failure];
            string sDispReject = QdtDisposition.DispositionStatuses[DispositionStatus.Reject];
            string sDispReviewed = QdtDisposition.DispositionStatuses[DispositionStatus.Reject];
            string sActionReviewed = QdtAction.ActionStatuses[QdtAction.ActionStatus.Reviewed];
            string sActionReject = QdtAction.ActionStatuses[QdtAction.ActionStatus.Reject];
            int unfinishedDispositions = qdtEntities.qdt_disposition.Where(n => n.dr_num == dr_num && n.status != sDispSuccess
                && n.status != sDispFailure && n.status != sDispReject && n.status != sDispReviewed).ToList().Count;
            int unfinishedActions = qdtEntities.qdt_action.Where(n => n.dr_num == dr_num && n.status != sActionReviewed && n.status != sActionReject).ToList().Count;

            Boolean finished = false;
            if (unfinishedActions == 0 && unfinishedDispositions == 0)
            {
                finished = true;
            }

            return this.Direct(new
            {
                unfinishedDispositions = unfinishedDispositions,
                unfinishedActions = unfinishedActions,
                finished = finished
            });
        }


        [DirectInclude]
        public ActionResult SearchItemOwnersByItem(string item)
        {
            using (PmbEntities db = new PmbEntities())
            {
                SlItem slItem = new SlItem(db.sl_item.Single(n => n.item == item));
                slItem.InitialProperties();

                return this.Direct(
                    new
                    {
                        success = true,
                        data = slItem
                    });
            }

        }


        [DirectInclude]
        public ActionResult SearchItemOwnersByItemAndOp(string item, int oper_num)
        {
            using (PmbEntities db = new PmbEntities())
            {
                SlOperation slOperation = new SlOperation(db.sl_operation.Single(n => n.item == item && n.oper_num == oper_num));
                slOperation.InitialProperties();

                return this.Direct(new
                {
                    success = true,
                    data = slOperation
                });
            }

        }


        [DirectInclude]
        public ActionResult GetOpsByJob(string job, int suffix)
        {
            List<qdtGetOpsByJobSP_Result> ops = qdtEntities.qdtGetOpsByJobSP(job, suffix).ToList();

            if (ops.Count > 0)
            {
                return this.Direct(new
                {
                    data = ops,
                    success = true
                });
            }
            else
            {
                return DirectFailure();
            }

        }

        //[DirectInclude]
        //[Obsolete]
        //public ActionResult SearchDrs(JObject o)
        //{


        //    var searchConditions = o["searchConditions"];

        //    string dr_num = searchConditions["dr_num"].Value<String>();
        //    string production_line = searchConditions["production_line"].Value<String>();
        //    string part_num = searchConditions["part_num"].Value<String>();
        //    string job_card = searchConditions["job_card"].Value<String>();
        //    DateTime? due_date_from = searchConditions["due_date_from"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["due_date_from"].Value<string>()).Year,
        //                                                                                          Convert.ToDateTime(searchConditions["due_date_from"].Value<string>()).Month,
        //                                                                                          Convert.ToDateTime(searchConditions["due_date_from"].Value<string>()).Day, 0, 0, 0);
        //    DateTime? due_date_to = searchConditions["due_date_to"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["due_date_to"].Value<string>()).Year,
        //                                                                            Convert.ToDateTime(searchConditions["due_date_to"].Value<string>()).Month,
        //                                                                            Convert.ToDateTime(searchConditions["due_date_to"].Value<string>()).Day + 1, 0, 0, 0);
        //    DateTime? create_date_from = searchConditions["create_date_from"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["create_date_from"].Value<string>()).Year,
        //                                                                                      Convert.ToDateTime(searchConditions["create_date_from"].Value<string>()).Month,
        //                                                                                      Convert.ToDateTime(searchConditions["create_date_from"].Value<string>()).Day, 0, 0, 0);
        //    DateTime? create_date_to = searchConditions["create_date_to"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["create_date_to"].Value<string>()).Year,
        //                                                                                  Convert.ToDateTime(searchConditions["create_date_to"].Value<string>()).Month,
        //                                                                                  Convert.ToDateTime(searchConditions["create_date_to"].Value<string>()).Day + 1, 0, 0, 0);
        //    int? qe_owner = searchConditions["dr_qe_owner"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["dr_qe_owner"].Value<string>());
        //    int? me_owner = searchConditions["dr_me_owner"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["dr_me_owner"].Value<string>());
        //    int? act_owner = searchConditions["act_owner"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["act_owner"].Value<string>());
        //    int? dr_type = searchConditions["dr_type"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["dr_type"].Value<string>());
        //    int? reason_code = searchConditions["reason_code"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["reason_code"].Value<string>());
        //    int? dr_creator = searchConditions["dr_creator"].Value<string>() == "" ? null : (int?)Convert.ToInt32(searchConditions["dr_creator"].Value<string>());



        //    using (QDTEntities db = new QDTEntities())
        //    {
        //        var drs = (from dr in db.qdt_dr
        //                   join drType in db.qdt_com_string on dr.dr_type equals drType.id
        //                   join createBy in db.sys_user on dr.create_by equals createBy.user_id
        //                   join qeOwner in db.hr_employee on dr.dr_qe_owner equals qeOwner.employee_id
        //                   join meOwner in db.hr_employee on dr.dr_me_owner equals meOwner.employee_id
        //                   join item in db.sl_item on dr.discrepancy_item equals item.item
        //                   join code in db.pmb_plan_code on item.plan_code equals code.plan_code
        //                   join action in db.qdt_action on dr.dr_num equals action.dr_num
        //                     into temp_action
        //                   from a in temp_action.DefaultIfEmpty()
        //                    join disposition in db.qdt_disposition on dr.dr_num equals disposition.dr_num
        //                     into temp_disposition
        //                    from d in temp_disposition.DefaultIfEmpty()
        //                //   join disposition in db.qdt_disposition on dr.dr_num equals disposition.dr_num

        //                   select new
        //                   {
        //                       dr = dr,
        //                       drType = new { qdtComString = drType },
        //                       createBy = new { user = createBy },
        //                       qeOwner = new { employee = qeOwner },
        //                       meOwner = new { employee = meOwner }
        //                   }).ToList().Distinct();

        //        return this.Direct(new
        //        {
        //            data = PagedData(o, drs.AsQueryable()),
        //            total = drs.Count(),
        //            success = true
        //        });

        //    }


        //}


        private bool IsPendingAction(string dr_num)
        {
            var actions = qdtEntities.qdt_action.Where(n => n.dr_num == dr_num);
            foreach (qdt_action action in actions)
            {
                if (action.status.Equals("approved"))
                {
                    return true;
                }
            }
            return false;
        }



        public void PrintDr(string drNum)
        {
            string outFileName = drNum + ".pdf";
            // string outFileDict = FileHandler.AppOutputFileRoot;
            // string outFileDict = "/test/";
            string outFileDict = Server.MapPath("~/Files/TempFile");
            string fullFileName = Path.Combine(outFileDict, outFileName);
            if (!Directory.Exists(fullFileName))
            {
                CreateDrPdf(drNum, outFileDict);
            }
            FileHandler.DownloadFile(fullFileName, outFileName, Response, true);

        }


        [DirectInclude]
        public ActionResult GetAttachments(string refNum)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {

                    var attachments = from att in db.sys_attachment
                                      join att_ref in db.sys_attachment_ref on att.attachment_id equals att_ref.attachment_id
                                      where att_ref.ref_num == refNum
                                      select new
                                      {
                                          attachmentUrl = att.file_path
                                      };

                    return DirectSuccess(attachments.ToList());
                }
            }
            catch
            {
                return DirectFailure("Call Method QDTColtroller GetActionAttachemts Failed!");
            }

        }

        //[DirectInclude]
        //public ActionResult GetDrAttachments(string drNum)
        //{
        //    try
        //    {
        //        using (QDTEntities db = new QDTEntities())
        //        {
        //            var attachments = from att in db.sys_attachment
        //                              join att_ref in db.sys_attachment_ref on att.attachment_id equals att_ref.attachment_id
        //                              where att_ref.ref_num == drNum
        //                              select new
        //                              {
        //                                  attachmentUrl = att.file_path
        //                              };

        //            return this.DirectSuccess(attachments.ToList());
        //        }
        //    }
        //    catch
        //    {
        //        return this.DirectFailure("Call Method QDTColtroller GetDrAttachments Failed!");
        //    }
        //}


        public void DownloadDrAttachment(string attachmentFullFileName)
        {
            string outFileDict = Server.MapPath("/qdtDrAttachments/");
            string fullPath = Path.Combine(outFileDict, attachmentFullFileName);
            FileHandler.DownloadFile(fullPath, attachmentFullFileName, Response, false);
        }

        public void DownloadActionAttachment(string attachmentFullFileName)
        {
            string outFileDict = Server.MapPath("/qdtActionAttachments/");
            string fullPath = Path.Combine(outFileDict, attachmentFullFileName);
            FileHandler.DownloadFile(fullPath, attachmentFullFileName, Response, false);
        }



        [DirectInclude]
        public ActionResult GetJobCardByJobSuffix(string job, int suffix)
        {
            string serialOrLot = "serial";
            pmbGetJobCardByJobSuffixSP_Result jobcard = new pmbGetJobCardByJobSuffixSP_Result();
            try
            {
                jobcard = qdtEntities.pmbGetJobCardByJobSuffixSP(job, suffix).Single();
            }
            catch
            {
                return DirectFailure();
            }

            if (jobcard != null)
            {
                string serial = null;
                string lot = null;
                if (jobcard.serial != null)
                {
                    serialOrLot = "serial";
                    serial = jobcard.serial;
                }
                else if (jobcard.lot != null)
                {
                    serialOrLot = "lot";
                    lot = jobcard.lot;
                }
                return this.Direct(new
                {
                    item = jobcard.item,
                    serial = serial,
                    lot = lot,
                    serialOrLot = serialOrLot,
                    success = true

                });
            }
            else
            {
                return DirectFailure();
            }

        }

        //[DirectInclude]
        //public ActionResult GetItemByJobSuffix(string job, int suffix)
        //{

        //}

        private void CreateDrPdf(string dr_num, string outFileDict)
        {


            QdtDiscrepancyReport dr = new QdtDiscrepancyReport(qdtEntities.qdt_dr.Where(n => n.dr_num == dr_num).Single());
            dr.InitialProperties();

            //BaseFont.AddToResourceSearch("iTextAsian.dll");
            //   BaseFont.AddToResourceSearch("iTextAsianCmaps.dll");
            //   BaseFont bf = BaseFont.CreateFont();
            //   iTextSharp.text.Font font = new iTextSharp.text.Font(bf);


            string filePath = Path.Combine(outFileDict, dr_num + ".pdf");
            Document document = new Document(PageSize.A4.Rotate(), 10, 10, 20, 20);

            FileStream fs = new FileStream(filePath, FileMode.Create);
            // using (FileStream fs = new FileStream(filePath, FileMode.Create))
            //  {
            PdfWriter writer = PdfWriter.GetInstance(document, fs);
            //   TrainingFormFooter footer = new TrainingFormFooter(this.GetServerPath());
            // writer.SetBoxSize("footer", new iTextSharp.text.Rectangle(10, 10, 832, 582));
            //     writer.PageEvent = footer;
            //**************************

            //PdfContentByte cb = writer.DirectContent;
            //cb.AddTemplate(HeaderAndFooterEvent.tpl, 266, 714);//调节模版显示的位置
            writer.SetBoxSize("footer", new Rectangle(10, 10, 832, 582));
            writer.PageEvent = new DRFooter(dr_num);

            document.Open();

            //writer.PageEvent = new HeaderAndFooterEvent(dr_num, writer.DirectContent.CreateTemplate(100, 100));


            // document.AddTitle("Discrepancy Report");

            // document.Add(CreateDrHeader(writer, dr_num));

            //Chunk chunk = new Chunk("Hello world", FontFactory.GetFont(FontFactory.COURIER, 20, iTextSharp.text.Font.ITALIC, new BaseColor(255, 0, 0)));
            //chunk.SetBackground(new BaseColor(0xFF, 0xFF, 0x00));
            //document.Add(chunk);
            string fontfile = Server.MapPath("~/Files/SIMHEI.TTF");
            //文件Title字体
            BaseFont basefont_Title = BaseFont.CreateFont(
               fontfile,
                 BaseFont.IDENTITY_H,
                 BaseFont.NOT_EMBEDDED);
            Font font_Title = new Font(basefont_Title, 26, Font.BOLD, BaseColor.BLACK);


            //表格列字体
            BaseFont basefont_table_column = BaseFont.CreateFont(
              fontfile,
              BaseFont.IDENTITY_H,
              BaseFont.NOT_EMBEDDED);
            Font font_table_column = new Font(basefont_table_column, 10, Font.NORMAL, BaseColor.BLACK);

            //表格header字体
            BaseFont basefont_table_header = BaseFont.CreateFont(
              fontfile,
              BaseFont.IDENTITY_H,
              BaseFont.NOT_EMBEDDED);
            Font font_table_header = new Font(basefont_table_header, 12, Font.BOLD, BaseColor.BLACK);


            //表格名称字体
            BaseFont basefont_table_name = BaseFont.CreateFont(
              fontfile,
              BaseFont.IDENTITY_H,
              BaseFont.NOT_EMBEDDED);
            Font font_table_name = new Font(basefont_table_name, 16, Font.BOLDITALIC, BaseColor.BLACK);

            //正文字体
            BaseFont basefont_Context = BaseFont.CreateFont(
              fontfile,
              BaseFont.IDENTITY_H,
              BaseFont.NOT_EMBEDDED);
            Font font_Context = new Font(basefont_Context, 11, Font.NORMAL, BaseColor.BLACK);

            //警告字体
            BaseFont basefont_Warning = BaseFont.CreateFont(
              fontfile,
              BaseFont.IDENTITY_H,
              BaseFont.NOT_EMBEDDED);
            Font font_Warning = new Font(basefont_Warning, 16, Font.NORMAL, BaseColor.RED);



            //空行留白字体
            BaseFont basefont_blank = BaseFont.CreateFont(
              fontfile,
              BaseFont.IDENTITY_H,
              BaseFont.NOT_EMBEDDED);
            Font font_blank = new Font(basefont_blank, 5, Font.NORMAL, BaseColor.BLACK);

            Paragraph p_blank = new Paragraph("  ", font_blank);

            PdfPCell blankCell = new PdfPCell();
            blankCell.Phrase = new Phrase("   ");
            blankCell.Border = 0;



            Paragraph version = new Paragraph("GE Aviation Suzhou F8700-006  ISSUE:05", font_table_name);
            PdfPCell version_cell = new PdfPCell(version);
            version_cell.HorizontalAlignment = Element.ALIGN_LEFT;
            version_cell.Border = 0;


            Paragraph print_time = new Paragraph("打印时间:" + DateTime.Now.ToString(), font_table_name);
            print_time.Font = font_Context;
            PdfPCell print_time_cell = new PdfPCell(print_time);
            print_time_cell.HorizontalAlignment = Element.ALIGN_RIGHT;
            print_time_cell.Border = 0;



            PdfPTable headerTable = new PdfPTable(new float[] { 1.0f, 1.0f });
            headerTable.WidthPercentage = 100f;
            headerTable.AddCell(version_cell);
            headerTable.AddCell(print_time_cell);
            document.Add(headerTable);




            Paragraph p_title = new Paragraph("Discrepancy Record", font_Title);
            p_title.Alignment = Element.ALIGN_CENTER;
            PdfPTable titleTable = new PdfPTable(new float[] { 1.0f });
            titleTable.WidthPercentage = 100f;
            titleTable.DefaultCell.BackgroundColor = BaseColor.GRAY;
            titleTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
            titleTable.DefaultCell.VerticalAlignment = PdfPCell.ALIGN_MIDDLE;
            titleTable.AddCell(p_title);
            titleTable.AddCell(blankCell);
            document.Add(titleTable);


            if (!dr.dr.status.Equals("closed"))
            {
                document.Add(new Phrase("注: 此DR还未关闭  This DR is not Closed!!!          \n", font_Warning));
            }

            Paragraph basicInformation = new Paragraph("零件信息 Basic Information.", font_table_name);
            document.Add(basicInformation);
            document.Add(p_blank);

            PdfPTable basicInformationTable = new PdfPTable(new float[] { 2, 1.5f, 0.1f, 2, 1.5f });
            basicInformationTable.WidthPercentage = 100f;




            basicInformationTable.AddCell(new Phrase("DR 号码 DR Number:", font_Context));
            basicInformationTable.AddCell(new Phrase(dr_num, font_Context));
            basicInformationTable.AddCell(blankCell);
            basicInformationTable.AddCell(new Phrase("零件号 Part Number:", font_Context));
            basicInformationTable.AddCell(new Phrase(dr.dr.discrepancy_item, font_Context));

            basicInformationTable.AddCell(new Phrase("序列号 Serial Number/Lot Number:", font_Context));
            basicInformationTable.AddCell(new Phrase((dr.dr.serial == null || dr.dr.serial == "") ? dr.dr.lot.ToString() : dr.dr.serial.ToString(), font_Context));
            basicInformationTable.AddCell(blankCell);
            basicInformationTable.AddCell(new Phrase("数量 Quantity:", font_Context));
            basicInformationTable.AddCell(new Phrase(dr.dr.quantity.ToString(), font_Context));

            basicInformationTable.AddCell(new Phrase("工作单号/采购单号 Order Number:", font_Context));
            basicInformationTable.AddCell(new Phrase(dr.dr.job.Trim().Equals("") ? "N/A" : dr.dr.job.Trim(), font_Context));
            basicInformationTable.AddCell(blankCell);
            basicInformationTable.AddCell(new Phrase("工作中心 Work Center:", font_Context));
            basicInformationTable.AddCell(new Phrase(dr.dr.wc.Trim().Equals("") ? "N/A" : dr.dr.wc.Trim(), font_Context));

            basicInformationTable.AddCell(new Phrase("DR 类型 DR Type:", font_Context));
            basicInformationTable.AddCell(new Phrase(GetLang() == "cn" ? dr.drType.qdtComString.cn_string : dr.drType.qdtComString.en_string, font_Context));
            basicInformationTable.AddCell(blankCell);
            basicInformationTable.AddCell(new Phrase("何处发现 Where Detected: ", font_Context));
            basicInformationTable.AddCell(new Phrase(GetLang() == "cn" ? dr.source.qdtComString.cn_string : dr.source.qdtComString.en_string, font_Context));

            basicInformationTable.AddCell(new Phrase("工序 Operation:", font_Context));
            basicInformationTable.AddCell(new Phrase(dr.dr.oper_num == null ? "N/A" : dr.dr.oper_num.ToString(), font_Context));
            basicInformationTable.AddCell(blankCell);
            basicInformationTable.AddCell(new Phrase("项目 Project:", font_Context));
            basicInformationTable.AddCell(new Phrase(dr.dr.Uf_item_ge_project, font_Context));

            basicInformationTable.AddCell(new Phrase("班次 Shift:", font_Context));
            basicInformationTable.AddCell(new Phrase(GetShift(dr.dr.create_date), font_Context));
            basicInformationTable.AddCell(blankCell);
            basicInformationTable.AddCell(new Phrase("提交人 Raised By:", font_Context));
            basicInformationTable.AddCell(new Phrase(GetLang() == "cn" ? dr.createBy.user.name_cn : dr.createBy.user.name_en, font_Context));

            basicInformationTable.AddCell(new Phrase("提交日期 Dated Raised:", font_Context));
            basicInformationTable.AddCell(new Phrase(dr.dr.create_date.ToString(), font_Context));
            basicInformationTable.AddCell(blankCell);
            basicInformationTable.AddCell(blankCell);
            basicInformationTable.AddCell(blankCell);


            document.Add(basicInformationTable);

            document.Add(p_blank);


            PdfPTable discrepancicyTable = new PdfPTable(new float[] { 1f, 5f, 5f });
            discrepancicyTable.HeaderRows = 0;
            discrepancicyTable.WidthPercentage = 100f;
            discrepancicyTable.SplitLate = false;
            discrepancicyTable.SplitRows = false;
            discrepancicyTable.DefaultCell.BackgroundColor = BaseColor.LIGHT_GRAY;
            //设置列头文字水平、垂直居中
            discrepancicyTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
            discrepancicyTable.DefaultCell.VerticalAlignment = PdfPCell.ALIGN_MIDDLE;

            // int discrepancyCount = 0;

            if (dr.discrepancies.Count() > 0)
            {
                Paragraph discrepancyTitle = new Paragraph("缺陷 Discrepancy", font_table_name);
                document.Add(discrepancyTitle);
                document.Add(p_blank);
                //  discrepancicyTable.AddCell("Index");
                discrepancicyTable.AddCell(new Phrase("Discrepancy ID", font_table_header));
                discrepancicyTable.AddCell(new Phrase("Descrepancy", font_table_header));
                discrepancicyTable.AddCell(new Phrase("Normal", font_table_header));
            }
            discrepancicyTable.DefaultCell.BackgroundColor = BaseColor.WHITE;
            //设置数据文字靠左居中
            discrepancicyTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_LEFT;
            foreach (QdtDiscrepancy discrepancy in dr.discrepancies)
            {
                // discrepancyCount++;
                //   discrepancicyTable.AddCell(discrepancyCount.ToString());
                discrepancicyTable.AddCell(new Phrase(discrepancy.discrepancy.disc_id.ToString(), font_table_column));
                discrepancicyTable.AddCell(new Phrase(discrepancy.discrepancy.description.ToString(), font_table_column));
                discrepancicyTable.AddCell(new Phrase(discrepancy.discrepancy.NormalDescription.ToString(), font_table_column));
            }
            document.Add(discrepancicyTable);


            PdfPTable dispositionTable = new PdfPTable(new float[] { 2f, 2f, 1f, 2f, 2f, 2f, 1.2f, 2f });
            dispositionTable.HeaderRows = 0;
            dispositionTable.WidthPercentage = 100f;
            dispositionTable.SplitLate = false;
            dispositionTable.SplitRows = false;
            dispositionTable.DefaultCell.BackgroundColor = BaseColor.LIGHT_GRAY;
            //设置列头文字水平、垂直居中
            dispositionTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
            dispositionTable.DefaultCell.VerticalAlignment = PdfPCell.ALIGN_MIDDLE;

            //   1.2f, 1.2f, 1f, 2f, 1.8f, 1f, 1.1f, 2f, 2f

            PdfPTable actionTable = new PdfPTable(new float[] { 4f, 8f, 8f, 20f, 10f, 7f, 7f, 13f, 13f });
            actionTable.HeaderRows = 0;
            actionTable.WidthPercentage = 100f;
            actionTable.SplitLate = false;
            actionTable.SplitRows = false;
            actionTable.DefaultCell.BackgroundColor = BaseColor.LIGHT_GRAY;
            //设置列头文字水平、垂直居中
            actionTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
            actionTable.DefaultCell.VerticalAlignment = PdfPCell.ALIGN_MIDDLE;


            List<qdt_disposition> dispositions = qdtEntities.qdt_disposition.Where(n => n.dr_num == dr_num).OrderBy(n => n.disp_rank).ToList();

            //if (dispositions.Count() > 0)
            //{
            //    Paragraph dispositionTitle = new Paragraph("部署 Disposition", font_table_name);
            //    document.Add(dispositionTitle);
            //    document.Add(p_blank);
            //}
            foreach (qdt_disposition disposition in dispositions)
            {

                if (!disposition.status.Equals(QdtDisposition.DispositionStatuses[DispositionStatus.Reject]))
                {

                    Paragraph dispositionTitle = new Paragraph("部署 Disposition", font_table_name);
                    document.Add(dispositionTitle);
                    document.Add(p_blank);

                    dispositionTable.DeleteBodyRows();
                    dispositionTable.DefaultCell.BackgroundColor = BaseColor.LIGHT_GRAY;
                    //设置列头文字水平、垂直居中
                    dispositionTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
                    dispositionTable.DefaultCell.VerticalAlignment = PdfPCell.ALIGN_MIDDLE;
                    dispositionTable.AddCell(new Phrase("Disposition Rank", font_table_header));
                    dispositionTable.AddCell(new Phrase("Disposition Type", font_table_header));
                    dispositionTable.AddCell(new Phrase("ME", font_table_header));
                    dispositionTable.AddCell(new Phrase("Dispose Date", font_table_header));
                    dispositionTable.AddCell(new Phrase("Reason", font_table_header));
                    dispositionTable.AddCell(new Phrase("Description", font_table_header));
                    dispositionTable.AddCell(new Phrase("Status", font_table_header));
                    dispositionTable.AddCell(new Phrase("Discrepancy", font_table_header));


                    QdtDisposition qdtDisposition = new QdtDisposition(disposition);
                    qdtDisposition.InitialProperties();

                    dispositionTable.DefaultCell.BackgroundColor = BaseColor.WHITE;
                    //设置数据文字靠左居中
                    dispositionTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_LEFT;

                    dispositionTable.AddCell(new Phrase(qdtDisposition.disposition.disp_rank.ToString(), font_table_column));
                    dispositionTable.AddCell(new Phrase(GetLang() == "cn" ? qdtDisposition.dispType.qdtComString.cn_string : qdtDisposition.dispType.qdtComString.en_string, font_table_column));
                    dispositionTable.AddCell(new Phrase(GetLang() == "cn" ? qdtDisposition.createBy.user.name_cn : qdtDisposition.createBy.user.name_en, font_table_column));
                    dispositionTable.AddCell(new Phrase(qdtDisposition.disposition.create_date.ToString(), font_table_column));
                    dispositionTable.AddCell(new Phrase(GetLang() == "cn" ? qdtDisposition.reasonType.qdtComString.cn_string : qdtDisposition.reasonType.qdtComString.en_string, font_table_column));
                    dispositionTable.AddCell(new Phrase(qdtDisposition.disposition.description.ToString(), font_table_column));
                    dispositionTable.AddCell(new Phrase(qdtDisposition.disposition.status, font_table_column));

                    String disp_discs = "";
                    if (qdtDisposition.discrepancies.Count() > 0)
                    {
                        disp_discs = qdtDisposition.discrepancies.ElementAt(0).discrepancy.disc_id.ToString();
                        for (int i = 1; i < qdtDisposition.discrepancies.Count; i++)
                        {
                            disp_discs += "," + qdtDisposition.discrepancies.ElementAt(i).discrepancy.disc_id.ToString();
                        }
                    }


                    dispositionTable.AddCell(new Phrase(disp_discs.Equals("") ? "N/A" : disp_discs, font_table_column));

                    document.Add(dispositionTable);


                    //document.Add("action");
                    List<qdt_action> actions = qdtEntities.qdt_action.Where(n => n.disp_id == disposition.disp_id).OrderBy(n => n.act_id).ToList();
                    List<QdtAction> qdtActions = new List<QdtAction>();

                    if (actions.Count() > 0)
                    {
                        Paragraph actionTitle = new Paragraph("措施 Action", font_table_name);
                        document.Add(actionTitle);
                        document.Add(p_blank);

                        actionTable.DeleteBodyRows();
                        //  PdfPCell blankCell = new PdfPCell(new Phrase(" "))
                        blankCell.Border = 0;
                        actionTable.DefaultCell.BackgroundColor = BaseColor.LIGHT_GRAY;
                        //设置列头文字水平、垂直居中
                        actionTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_CENTER;
                        actionTable.DefaultCell.VerticalAlignment = PdfPCell.ALIGN_MIDDLE;


                        //  actionTable.AddCell(blankCell);
                        actionTable.AddCell(new Phrase("ID", font_table_header));
                        actionTable.AddCell(new Phrase("Discrepancy", font_table_header));
                        actionTable.AddCell(new Phrase("Action Type", font_table_header));
                        actionTable.AddCell(new Phrase("Short Term Action", font_table_header));
                        //  actionTable.AddCell(new Phrase("Create By", font_table_header));
                        actionTable.AddCell(new Phrase("Create Date", font_table_header));
                        actionTable.AddCell(new Phrase("Owner", font_table_header));
                        actionTable.AddCell(new Phrase("Status", font_table_header));
                        actionTable.AddCell(new Phrase("Description", font_table_header));
                        actionTable.AddCell(new Phrase("Remark", font_table_header));

                        foreach (qdt_action action in actions)
                        {
                            QdtAction qdtAction = new QdtAction(action);
                            qdtAction.InitialProperties();

                            String act_discs = "";
                            if (qdtAction.discrepancies.Count > 0)
                            {
                                act_discs = qdtAction.discrepancies.ElementAt(0).discrepancy.disc_id.ToString();
                                for (int i = 1; i < qdtAction.discrepancies.Count; i++)
                                {
                                    act_discs += "," + qdtAction.discrepancies.ElementAt(i).discrepancy.disc_id.ToString();
                                }
                            }

                            actionTable.DefaultCell.BackgroundColor = BaseColor.WHITE;
                            //设置列头文字水平、垂直居中
                            actionTable.DefaultCell.HorizontalAlignment = PdfPCell.ALIGN_LEFT;

                            // actionTable.AddCell(blankCell);
                            actionTable.AddCell(new Phrase(qdtAction.action.act_id.ToString(), font_table_column));
                            actionTable.AddCell(new Phrase(act_discs.Equals("") ? "N/A" : act_discs, font_table_column));
                            actionTable.AddCell(new Phrase(GetLang() == "cn" ? qdtAction.actionType.qdtComString.cn_string : qdtAction.actionType.qdtComString.en_string, font_table_column));
                            actionTable.AddCell(new Phrase(qdtAction.action.st_action == "" ? "N/A" : qdtAction.action.st_action, font_table_column));
                            //  actionTable.AddCell(new Phrase(GetLang() == "cn" ? qdtAction.createBy.user.name_cn : qdtAction.createBy.user.name_en, font_table_column));
                            actionTable.AddCell(new Phrase(qdtAction.action.create_date.ToString(), font_table_column));
                            actionTable.AddCell(new Phrase(GetLang() == "cn" ? qdtAction.owner.employee.name_cn : qdtAction.owner.employee.name_en, font_table_column));
                            actionTable.AddCell(new Phrase(qdtAction.action.status, font_table_column));
                            actionTable.AddCell(new Phrase(qdtAction.action.description == "" ? "N/A" : qdtAction.action.description, font_table_column));
                            actionTable.AddCell(new Phrase(qdtAction.action.remark == "" ? "N/A" : qdtAction.action.remark, font_table_column));
                            //  qdtActions.Add(qdtaction);
                        }
                    }
                    else // 如果第二轮没有action，需要把actionTable重置  
                    {
                        actionTable = new PdfPTable(new float[] { 4f, 8f, 8f, 20f, 10f, 7f, 7f, 13f, 13f });
                    }
                    document.Add(actionTable);
                    document.Add(p_blank);
                    document.Add(p_blank);
                    document.Add(p_blank);
                }

            }
            // document.Add(dispositionTable);
            document.Add(new Phrase("                                     如果零件报废,确认是否有配件", font_Context));
            document.Add(p_blank);
            document.Add(new Phrase("ME sign/Date:" + dr.meOwner.employee.name_cn + " " + dr.meOwner.employee.name_en + "      ", font_Context));


            if (dr.dr.status.Equals("closed"))
            {
                document.Add(new Phrase("Shop Leader Sign/Date:_________________        ", font_Context));
                if (dr.closeBy != null)
                {
                    document.Add(new Phrase("QE Close/Date:" + dr.closeBy.user.name_cn + " " + dr.closeBy.user.name_en + " " + dr.dr.close_date + "         ", font_Context));
                    document.Add(new Phrase("\n如果零件报废或产生Case Record， 必须递交运营经理及质量经理签名：__________________\n", font_Context));
                }
                else
                {
                    document.Add(new Phrase("\n如果零件报废或产生Case Record， 必须递交运营经理及质量经理签名：____________________\n", font_Context));
                    document.Add(new Phrase("注: 此DR还未关闭  This DR is not Closed!!!          \n", font_Warning));
                }
            }

            document.Close();
            // }

        }

        private string GetShift(DateTime dateTime)
        {
            double hour = dateTime.Hour + dateTime.Minute / (double)60;
            if (hour > 8.5 && hour <= 17)
            {
                return "白班";
            }
            else if (hour > 17 && hour <= 24 || hour > 0 && hour <= 1)
            {
                return "中班";
            }
            else if (hour > 1 && hour <= 8.5)
            {
                return "夜班";
            }
            else
            {
                return "N/A";
            }
        }

        private PdfPTable CreateDrHeader(PdfWriter writer, string dr_num)
        {
            return null;
        }

    }
}
