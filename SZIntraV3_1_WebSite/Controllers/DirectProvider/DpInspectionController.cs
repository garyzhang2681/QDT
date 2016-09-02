using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using Newtonsoft.Json.Linq;
using NPOI.SS.Formula.Functions;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using ProductionManagement.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.System;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpInspectionController : QdtBaseController
    {
        /// <summary>
        /// Inspection type list
        /// </summary>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult GetInspectionType(JObject o)
        {
            string language = o["language"].Value<string>();
            string category = o["category"].Value<string>();
            using (QDTEntities db = new QDTEntities())
            {
                var data = (from qits in db.qdt_inspection_type_string
                            join qit in db.qdt_inspection_type on qits.inspection_type_id equals qit.id
                            join ql in db.qdt_locale on qits.locale_id equals ql.id
                            where ql.name == language && qit.category == category
                            orderby qits.name
                            select new
                            {
                                inspection_type = new
                                {
                                    name = qits.name,
                                    category = qit.category,
                                    inspection_type_id = qits.inspection_type_id,
                                    language = language
                                }
                            }).ToList();
                return DirectSuccess(data);
            }
        }


        [DirectInclude]
        public ActionResult GetPreviousAvailableOperations(string job, int suffix, int operNum)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    var previousUnavailableOps = db.qdt_inspection.Where(n => n.oper_num < operNum && n.wo.Equals(job) && n.suffix == suffix &&
                        ((n.status.Equals("finished") && n.passed == true)
                        || n.status.Equals("unfinished")
                        || n.status.Equals("started")
                        )).Select(n => n.oper_num.Value).ToList();

                    var previousAvailableOps = db.qdtGetOpsByJobSP(job, suffix).Where(n => n.oper_num <= operNum && previousUnavailableOps.IndexOf(n.oper_num) < 0).Select(n => new
                        {
                            oper_num = n.oper_num,
                            wc = n.wc
                        }).ToList();


                    return DirectSuccess(previousAvailableOps);
                }

            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController GetPreviousOperations Failed!");
            }

        }

        //[DirectInclude]
        //public ActionResult GetProjectByInspectionType(JObject o)
        //{

        //    try
        //    {
        //        int? inspection_type_id = o["inspection_type_id"].Value<int?>();
        //        string query = o["query"].Value<string>().ToUpper();
        //        using (QDTEntities db = new QDTEntities())
        //        {
        //            int? id = Convert.ToInt32(inspection_type_id);
        //            var data = db.qdt_inspection_project.Where(n => n.inspection_type_id == id && n.project.ToUpper().Contains(query)).OrderBy(n => n.project);
        //            return this.DirectSuccess(data.ToList());
        //        }
        //    }
        //    catch
        //    {
        //        return this.DirectFailure("Call Method DpInspectionController GetProjectByInspectionType Failed!");
        //    }

        //}

        /// <summary>
        /// Check if the serial numbers same item
        /// </summary>
        /// <returns>Item, Valid Operations</returns>
        [DirectInclude]
        public ActionResult CheckSameItem(string serials)
        {
            try
            {
                var serialList = serials.Split(new string[] { "\n", "\r" }, StringSplitOptions.RemoveEmptyEntries);
                // string item = "";
                string firstSerial = "";

                using (QDTEntities db = new QDTEntities())
                {
                    firstSerial = serialList[0].Trim();
                    // var joxxxbs = db.QDT_Job.Where(n => n.Uf_Sno.Equals(firstSerial));
                    //  var jobs = db.QDT_Job.Where(n => n.Uf_Sno.Equals(firstSerial.Trim()));
                    //  var job = db.QDT_Job.Single(n => n.Uf_Sno.Trim().Equals(firstSerial.Trim()) && n.stat.Equals("R") && !n.job.StartsWith("MR") && !n.job.StartsWith("MCR"));
                    QDT_Job firstJob = GetJobBySerialOrLot(firstSerial);
                    List<qdtGetOpsByJobSP_Result> ops = db.qdtGetOpsByJobSP(firstJob.job, firstJob.suffix).ToList(); //TODO  suffix


                    foreach (var serial in serialList)
                    {
                        //  var currentJob = db.QDT_Job.Single(n => n.Uf_Sno.Trim().Equals(serial.Trim()) && n.stat.Equals("R") && !n.job.StartsWith("MR") && !n.job.StartsWith("MCR"));
                        QDT_Job currentJob = GetJobBySerialOrLot(serial);


                        var existInspections = db.qdt_inspection.Where(n => n.wo == currentJob.job && (n.status.Equals("started") || n.status.Equals("unfinished") || (n.status.Equals("finished") && n.passed.Value == true))).ToList();// 已经存在的检验，包括1，开始的检验；2，未完成的检验；3，完成的检验中通过检验的检验项，{不包括完成但是没有通过的检验}

                        foreach (var existInspection in existInspections)
                        {
                            ops = ops.Where(n => n.oper_num != existInspection.oper_num).ToList();//  去除已经calcle的,和没有检验通过的检验，可以送检的OP，

                        }


                        if (!firstJob.item.Equals(GetJobBySerialOrLot(serial).item))
                        {
                            // return DirectFailure("The input serials contians different items. </br>Please check again!");
                            return DirectFailure("序列号不是同一个item，请认真检查");
                        }
                    }



                    decimal quantity = db.qdtGetJobReleasedQuantitySP(firstJob.job, firstJob.suffix).Single().Value;

                    if (ops.Count > 0)
                    {
                        return this.Direct(new
                        {
                            item = firstJob.item,
                            ops = ops,
                            quantity = quantity,
                            success = true
                        });
                    }
                    if (ops.Count == 0)
                    {
                        return DirectFailure("如果是单个零件送检，该零件所有工序都已经送检</br>如果是批量送检，该零件的该工序至少已经有一件已经送检过了，请确认。");
                    }
                    else
                    {
                        return DirectFailure("Call Method DpInspectionController CheckSameItem (get ops) Failed");
                    }
                }
            }
            catch(Exception e)
            {
                string err = e.Message;
                return DirectFailure("Call Method DpInspectionController CheckSameItem Failed </br> 请将出错内容截图并联系IT");
            }

        }


        [DirectInclude]
        public ActionResult DeleteInspection(string inspectionIds, int userId)
        {
            try
            {
                string[] ids = inspectionIds.Split(new char[1] { ',' });
                using (QDTEntities db = new QDTEntities())
                {
                    DateTime now = DateTime.Now;
                    foreach (string id in ids)
                    {
                        int inspectionId = Convert.ToInt32(id);

                        var inspection = db.qdt_inspection.Single(n => n.id == inspectionId);

                        inspection.update_date = now;
                        inspection.update_by = userId;
                        inspection.status = "canceled";
                        inspection.priority = 0;
                        inspection.urgency = null;
                        inspection.passed = null;

                    }

                    db.SaveChanges();

                }
                return DirectSuccess();
            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController DeleteInspection Failed!");
            }
        }

        [DirectInclude]
        public ActionResult GetInspectionItemCategory(string query)
        {
            return null;
        }

        [DirectInclude]
        public ActionResult GetInspectionItemByCategory(string category, string query)
        {
            return null;
        }



        [DirectInclude]
        public ActionResult UpdataInspectionResult(string inspectionIds, bool passed, int userId)
        {
            try
            {
                string[] ids = inspectionIds.Split(new char[1] { ',' });
                using (QDTEntities db = new QDTEntities())
                {
                    DateTime now = DateTime.Now;
                    foreach (string id in ids)
                    {
                        int inspection_id = Convert.ToInt32(id);

                        var inspection = db.qdt_inspection.Single(n => n.id == inspection_id);
                        inspection.passed = passed;
                        inspection.end_time = now;
                        inspection.update_date = now;
                        inspection.update_by = userId;
                        inspection.status = "finished";

                    }

                    db.SaveChanges();

                }
                UpdateInspectionPriority();
                return DirectSuccess();

            }

            catch
            {
                return DirectFailure("Call Method DpInspectionController UpdataInspectionResult Failed!");
            }
        }


        [DirectInclude]
        public ActionResult GetInspectionLocation(JObject o)
        {
            try
            {
                string language = o["language"].Value<string>();
                bool viewAll = o["view_all"].Value<bool>();
                using (QDTEntities db = new QDTEntities())
                {

                    var data = (from qils in db.qdt_inspection_location_string
                                join qil in db.qdt_inspection_location on qils.inspection_location_id equals qil.id
                                join ql in db.qdt_locale on qils.locale_id equals ql.id
                                where ql.name == language
                                select new
                                {
                                    inspection_location = new
                                    {
                                        inspection_location_id = qils.inspection_location_id,
                                        name = qils.name,
                                        language = language
                                    }
                                }).ToList();
                    if (viewAll)
                    {
                        data.Add(new
                            {
                                inspection_location = new
                                {

                                    inspection_location_id = 0,
                                    name = "View All",
                                    language = "en"
                                }
                            });
                    }

                    return DirectSuccess(data);
                }
            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController GetInspectionLocation Failed!");
            }
        }



        [DirectInclude]
        public ActionResult GetInformationBySerial(string serial)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {

                    string[] serials = serial.Split(new char[1] { ',' });
                    string firstSerial = serials[0];
                    string item = db.QDT_Serial.Single(n => n.ser_num.Equals(firstSerial)).item;
                    foreach (string s in serials)
                    {
                        if (item != db.QDT_Serial.Single(n => n.ser_num == s).item)
                        {
                            return DirectSuccess("您输入的序列号不属于同一个item的，请检查确认！");
                        }
                    }

                    return this.Direct(
                     new
                     {
                         //TODO: 这个item的operation List，或者是这些序列号对应的operation List
                         success = true,
                         item = item
                     }
                );

                }

            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController GetInformationBySerial Failed");
            }
        }


        //[DirectInclude]
        //public ActionResult GetInspection(JObject o)
        //{
        //    try
        //    {

        //        using (QDTEntities db = new QDTEntities())
        //        {
        //            string language = GetLang();
        //            var data = (from qi in db.qdt_inspection
        //                        join qils in db.qdt_inspection_location_string on qi.inspection_location_id equals qils.inspection_location_id
        //                        join qits in db.qdt_inspection_type_string on qi.inspection_type_id equals qits.inspection_type_id
        //                        join su in db.sys_user on qi.create_by equals su.user_id
        //                        join ql in db.qdt_locale on new { a = qils.locale_id, b = qits.locale_id } equals new { a = ql.id, b = ql.id }
        //                        where ql.name == language && qi.create_by == 396 && qi.passed == null
        //                        select new
        //                        {
        //                            inspection_record = new
        //                            {
        //                                qdt_inspection = qi,
        //                                location = qils.name,
        //                                type = qits.name,
        //                                create_by = language == "en" ? su.name_en : su.name_cn,
        //                                create_by_sso = su.sso,
        //                                language = language
        //                            }
        //                        }).ToList();
        //            return DirectSuccess(PagedData(o, data.AsQueryable()), data.Count());
        //        }
        //    }
        //    catch
        //    {
        //        return this.DirectFailure("Call Method DpInspectionController GetInspection(JObject o) Failed");
        //    }
        //}
        [DirectInclude]
        public ActionResult GetInspection(JObject o)
        {
            try
            {
                string query = o["search_wo_item"].Value<string>().Trim().ToLower();
                int locationId = o["inspection_location_id"].Value<int>();
                bool onlyUnfinished = o["only_unfinished"].Value<bool>();

                using (PmbEntities pmb = new PmbEntities())
                using (QDTEntities db = new QDTEntities())
                {
                    string language = GetLang();

                    var inspectionRecords = db.qdtGetInspectionRecordsSP(locationId, language, query).ToList();

                    int count = inspectionRecords.Count();


                    inspectionRecords = PagedData(o, inspectionRecords.AsQueryable()).ToList();

                    var allComments = (from d in inspectionRecords
                                       join c in db.sys_comment on d.id equals int.Parse(c.attach_id)
                                       select c);

                    Dictionary<int, string> dic = new Dictionary<int, string>();
                    foreach (var d in inspectionRecords)
                    {
                        var comments = (from comment in allComments
                                        join user in db.sys_user on comment.create_by equals user.user_id
                                        where int.Parse(comment.attach_id) == d.id
                                        select new
                                        {
                                            comment = comment,
                                            create_by = user
                                        }).ToList();

                        string commentsText = "";

                        if (d.urgent_reason != null && !d.urgent_reason.Equals(""))
                        {
                            commentsText += GetLang() == "cn" ? "加急原因: " : ("Urgent Reason: ");
                            commentsText += d.urgent_reason + "<br>";
                        }

                        if (!d.remark.Equals("") && d.remark != null)
                        {

                            commentsText += d.create_date + "  " + d.create_by + " " + d.remark + "<br>";
                        }

                        if (comments.Count() > 0)
                        {
                            foreach (var c in comments)
                            {
                                string name = GetLang() == "cn" ? c.create_by.name_cn : c.create_by.name_en;
                                commentsText += c.comment.create_date + "  " + name + " " + c.comment.comment + "<br>";
                            }
                        }
                        dic.Add(Convert.ToInt32(d.id), commentsText);
                    }


                    var result = (from d in inspectionRecords
                                  join di in dic on d.id equals di.Key into Temp
                                  from t in Temp.DefaultIfEmpty()
                                  select new
                                  {
                                      id = d.id,
                                      item = d.item,
                                      wo = d.wo,
                                      suffix = d.suffix,
                                      oper_num = d.oper_num,
                                      quantity = d.quantity,
                                      urgent_reason = d.urgent_reason,
                                      urgency = d.urgency,
                                      start_time = d.start_time,
                                      end_time = d.end_time,
                                      passed = d.passed,
                                      dr_num = d.dr_num,
                                      create_date = d.create_date,
                                      update_date = d.update_date,
                                      update_by = d.create_by,
                                      remark = d.remark,
                                      status = d.status,
                                      priority = d.priority,
                                      parent_id = d.parent_id,

                                      serial = d.serial,
                                      location = d.location,
                                      type = d.type,
                                      create_by = d.create_by,
                                      create_by_sso = d.create_by_sso,
                                      project = d.project ?? "NA",
                                      inspector = d.inspector,
                                      inspector_sso = d.inspector_sso,

                                      comments = t.Value,
                                  }).ToList();
                    return DirectSuccess(result, count);


                }
            }
            catch(Exception e)
            {
                var err = e.Message;
                return DirectFailure("Call Method DpInspectionController GetInspection Failed");
            }
        }


        private List<object> GetInspection(string location, bool includeCompleted, DateTime startTime, DateTime endTime, string query)
        {
            //query: item or serial or job
            return null;
        }

        public void ExportInspection()
        {
            Response.Write("Building..");
            Response.End();
        }

        [FormHandler]
        [DirectInclude]
        public ActionResult SendDefaultInspection()
        {
            try
            {//TODO  : 需要检验各个信息是否符合要求，再次检验是不是所有的serial都是同一个item
                var form = Request.Form;
                string item = form["part_num"];
                //  string wo = form['']
                int oper_num = Convert.ToInt32(form["oper_num"]);
                //  int quantity = 1; //TODO
                int inspection_location_id = Convert.ToInt32(form["inspection_location"]);
                int inspection_type_id = Convert.ToInt32(form["inspection_type"]);
                //int quantity = Convert.ToInt32(form["quantity"]);
                //TODO: should be released quantity for each job order
                int quantity = 1;
                string remark = form["remark"];
                int create_by = Convert.ToInt32(form["create_by"]);

                string[] serials = form["serial"].Split(new string[] { "\n", "\r" }, StringSplitOptions.RemoveEmptyEntries);




                using (QDTEntities db = new QDTEntities())
                {
                    QDT_Job firstJob = GetJobBySerialOrLot(serials[0]);
                    //   var job = db.QDT_Job.Single(n => n.Uf_Sno == firstSerial.Trim());
                    List<qdtGetOpsByJobSP_Result> ops = db.qdtGetOpsByJobSP(firstJob.job, firstJob.suffix).ToList(); //TODO  suffix
                    int count = 0;
                    foreach (qdtGetOpsByJobSP_Result op in ops)
                    {
                        if (op.oper_num != oper_num)
                        {
                            count++;
                        }
                    }
                    if (count == ops.Count())
                    {
                        return DirectFailure("请选择的工序有误，请重新选择工序！");
                    }


                    foreach (string serial in serials)
                    {
                        QDT_Job job = GetJobBySerialOrLot(serial);
                        string wo = job.job;
                        int suffix = job.suffix;
                        var inspection = new qdt_inspection
                                          {
                                              item = item,
                                              wo = wo,
                                              suffix = suffix,
                                              oper_num = oper_num,
                                              quantity = quantity,
                                              inspection_location_id = inspection_location_id,
                                              inspection_type_id = inspection_type_id,
                                              project_id = null,
                                              urgency = null,
                                              start_time = null,
                                              end_time = null,
                                              passed = null,
                                              dr_num = null,
                                              create_date = DateTime.Now,
                                              create_by = create_by,
                                              update_date = DateTime.Now,
                                              update_by = create_by,
                                              remark = remark,
                                              status = "unfinished",
                                              priority = 0
                                          };
                        db.qdt_inspection.AddObject(inspection);
                    }

                    db.SaveChanges();
                }
                UpdateInspectionPriority();

                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure("Call Method DpInspectionController SendDefaultInspection Failed!" + e.Message);
            }
        }

        [FormHandler]
        [DirectInclude]
        public ActionResult SendCustomInspection()
        {
            try
            {
                var form = Request.Form;
                string item = form["part_num"];
                //TODO ： 检查item是否存在
                //  string wo = form['']
                int project_id = Convert.ToInt32(form["project"]);//TODO  数据库中还没有此字段
                int create_by = Convert.ToInt32(form["create_by"]);
                int quantity = Convert.ToInt32(form["quantity"]);
                int inspection_location_id = Convert.ToInt32(form["inspection_location"]);
                int inspection_type_id = Convert.ToInt32(form["inspection_type"]);
                string remark = form["remark"];
                string wo = "";
                using (QDTEntities db = new QDTEntities())
                {
                    wo = db.qdtGenerateNumberSP("custom_inspection").Single();
                    var inspection = new qdt_inspection
                    {
                        item = item,
                        wo = wo,
                        suffix = null,
                        oper_num = null,
                        quantity = quantity,
                        project_id = project_id,
                        inspection_location_id = inspection_location_id,
                        inspection_type_id = inspection_type_id,
                        urgency = null,
                        start_time = null,
                        end_time = null,
                        passed = null,
                        dr_num = null,
                        create_date = DateTime.Now,
                        create_by = create_by,
                        update_date = DateTime.Now,
                        update_by = create_by,
                        remark = remark,
                        status = "unfinished",
                        priority = 0
                    };

                    db.qdt_inspection.AddObject(inspection);
                    db.SaveChanges();

                }
                UpdateInspectionPriority();
                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure("Call Method DpInspectionController SendCustomInspection Failed!" + e.Message);
            }
        }

        [FormHandler]
        [DirectInclude]
        public ActionResult ChangeInspectionLocation()
        {
            try
            {
                var form = Request.Form;
                string inspectionIds = form["selected_inspections"];
                int locationId = Convert.ToInt32(form["inspection_location"]);
                string[] ids = inspectionIds.Split(new char[1] { ',' });
                int changeBy = Convert.ToInt32(form["change_by"]);
                using (QDTEntities db = new QDTEntities())
                {
                    foreach (string id in ids)
                    {
                        int inspection_id = Convert.ToInt32(id);
                        var inspection = db.qdt_inspection.Single(n => n.id == inspection_id);
                        inspection.inspection_location_id = locationId;
                        inspection.update_date = DateTime.Now;
                        inspection.update_by = changeBy;

                    }
                    db.SaveChanges();
                }
                return DirectSuccess();
            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController ChangeInspectionLocation Failed!");
            }
        }


        [FormHandler]
        [DirectInclude]
        public ActionResult EditInspection()
        {

            var form = Request.Form;
            string inspectionIds = form["selected_inspections"];

            int locationId = Convert.ToInt32(form["inspection_location"] == "" ? "-1" : form["inspection_location"]);
            int operNumber = Convert.ToInt32(form["oper_num"] == "" ? "-1" : form["oper_num"]);
            string[] ids = inspectionIds.Split(new char[1] { ',' });
            int editBy = Convert.ToInt32(form["edit_by"]);
            using (QDTEntities db = new QDTEntities())
            {
                foreach (string id in ids)
                {
                    int inspectionId = Convert.ToInt32(id);
                    qdt_inspection inspection = db.qdt_inspection.Single(n => n.id == inspectionId);
                    if (locationId != -1)
                    {
                        inspection.inspection_location_id = locationId;
                    }
                    if (operNumber != -1)
                    {
                        inspection.oper_num = operNumber;
                    }
                    inspection.update_date = DateTime.Now;
                    inspection.update_by = editBy;

                }
                db.SaveChanges();
            }
            return DirectSuccess();

        }



        [DirectInclude]
        [FormHandler]
        public ActionResult SetUrgent()
        {
            try
            {
                var form = Request.Form;
                string inspectionIds = form["selected_inspections"];
                string reason = form["reason"];
                string[] ids = inspectionIds.Split(new char[1] { ',' });
                int prioritizeBy = Convert.ToInt32(form["prioritize_by"]);
                using (QDTEntities db = new QDTEntities())
                {
                    foreach (string id in ids)
                    {
                        int inspection_id = Convert.ToInt32(id);
                        var inspection = db.qdt_inspection.Single(n => n.id == inspection_id);
                        inspection.urgency = 1;
                        //     inspection.urgent_reason = inspection.urgent_reason + "Urgent:" + reason + " By:" + prioritizeBy + " " + System.DateTime.Today + " || ";

                        inspection.urgent_reason = inspection.urgent_reason + reason + " || ";
                        inspection.update_date = DateTime.Now;
                        inspection.update_by = prioritizeBy;
                    }
                    db.SaveChanges();
                }
                UpdateInspectionPriority();
                return DirectSuccess();
            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController SetUrgent Failed!");
            }
        }


        [DirectInclude]
        [FormHandler]
        public ActionResult SetAndon()
        {
            try
            {
                var form = Request.Form;
                string inspectionIds = form["selected_inspections"];
                string reason = form["reason"];
                string[] ids = inspectionIds.Split(new char[1] { ',' });
                int andonBy = Convert.ToInt32(form["prioritize_by"]);
                using (QDTEntities db = new QDTEntities())
                {
                    foreach (string id in ids)
                    {
                        int inspection_id = Convert.ToInt32(id);
                        var inspection = db.qdt_inspection.Single(n => n.id == inspection_id);
                        inspection.urgency = 2;
                        //   inspection.urgent_reason = inspection.urgent_reason + "Andon:  " + reason + "By " + andonBy + System.DateTime.Today + " || ";

                        inspection.urgent_reason = inspection.urgent_reason + reason + " || ";
                        inspection.update_date = DateTime.Now;
                        inspection.update_by = andonBy;
                    }
                    db.SaveChanges();
                }
                UpdateInspectionPriority();
                return DirectSuccess();
            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController SetAndon Failed!");
            }
        }

        [DirectInclude]
        [FormHandler]
        public ActionResult UpdateInspectionComment()
        {
            try
            {
                var form = Request.Form;
                string inspectionIds = form["selected_inspections"];
                string remark = form["comment"];
                string[] ids = inspectionIds.Split(new char[1] { ',' });
                int addBy = Convert.ToInt32(form["add_by"]);

                using (QDTEntities db = new QDTEntities())
                {
                    foreach (string id in ids)
                    {
                        var comment = new sys_comment
                        {
                            attach_to = "qdt_inspection",
                            attach_id = id,
                            comment = remark,
                            create_by = addBy,
                            create_date = DateTime.Now
                        };
                        db.sys_comment.AddObject(comment);
                    }
                    db.SaveChanges();
                }

                return this.DirectSuccess();
            }
            catch (Exception e)
            {
                return this.DirectFailure(e.InnerException.Message);
            }

        }

        [DirectInclude]
        public ActionResult GetProject(JObject o)
        {
            try
            {
                int? inspection_type_id = o["inspection_type_id"].Value<int?>();
                string query = o["query"].Value<string>().ToUpper();
                using (PmbEntities db = new PmbEntities())
                {
                    int? id = Convert.ToInt32(inspection_type_id);
                    var data = db.pmb_custom_project.Where(n => n.category_id == id && n.project.ToUpper().Contains(query)).OrderBy(n => n.project);
                    return DirectSuccess(data.ToList());
                }
            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController GetProject Failed!");
            }
            //try
            //{
            //    using (QDTEntities db = new QDTEntities())
            //    {
            //        var projects = db.qdt_inspection_project.Select(n=>n);
            //        return this.DirectSuccess(PagedData(o,projects),projects.Count());
            //    }
            //}
            //catch
            //{
            //    return this.DirectFailure("Call Method DpInspectionController GetProject Failed!");
            //}
        }


        [DirectInclude]
        public ActionResult GetProjectInfo(int inspectionTypeId, int projectId)
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    var projectInfo = db.pmb_custom_project.Single(n => n.category_id == inspectionTypeId && n.project_id == projectId);
                    return DirectSuccess(projectInfo);
                }
            }
            catch
            {
                return DirectFailure("Call Method DpInspectionController GetProjectInfo Failed");
            }
        }


        private void UpdateInspectionPriority()
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    db.qdtUpdateInspectionPrioritySP();
                }
            }
            catch
            {
                DirectFailure("Call Method DpInspectionController UpdateInspectionPriority Failed");
            }
        }


        private QDT_Job GetJobBySerialOrLot(string serialOrlot)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    return db.QDT_Job.FirstOrDefault(n => !n.job.StartsWith("MR") && !n.job.StartsWith("MCR") && (n.Uf_Sno.Trim().ToUpper().Equals(serialOrlot.Trim().ToUpper()) ||
                        n.Uf_Lot.Trim().ToUpper().Equals(serialOrlot.Trim().ToUpper())));// modified by ivan -20160415; change to FirstOrDefault()
                }
            }
            catch (Exception e) { var err = e.Message; return null; }
        }
    }
}
