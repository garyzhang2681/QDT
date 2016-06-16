using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data.Common.CommandTrees;
using System.Linq;
using System.Net;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using Common.Utility.Direct;
using Ext.Direct.Mvc;
using NPOI.HSSF.UserModel;
using NPOI.HSSF.Util;
using NPOI.SS.Formula.Eval;
using NPOI.SS.Formula.Functions;
using NPOI.SS.UserModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using Newtonsoft.Json.Linq;
using SuzhouHr.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.Ll;
using SuzhouHr.Models;
using Common.Utility.Application;
using System.Diagnostics;
using System.Configuration;
using System.IO;
using SZIntraV3_1_WebSite.Models;
using Common.Utility.IO;
using SZIntraV3_1_WebSite.Models.Tq;
using Common.Utility.Extension;
using SZIntraV3_1_WebSite.Models.System;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpLlController : QdtBaseController
    {



        [DirectInclude]
        public ActionResult GetCategories()
        {
            using (QDTEntities db = new QDTEntities())
            {
                var categories = db.qdt_ll_category.ToList();
                categories.Add(new qdt_ll_category()
                {
                    category = GetLang().Equals("en") ? "All" : "所有",
                    id = 0
                });
                return DirectSuccess(categories);
            }
        }

        #region working group

        /// <summary>
        /// [deprecated] refer to DpHrController.GetWorkingGroups
        /// </summary>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult GetWorkingGroup()
        {
            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                var workingGroups = db.hr_working_group.OrderBy(n=>n.seq).ToList();
                workingGroups.Add(new hr_working_group()
                {
                    working_group_id = 0,
                    working_group = GetLang().Equals("en") ? "All" : "所有"
                });
                return DirectSuccess(workingGroups);
            }
        }


        #endregion

        [DirectInclude]
        public ActionResult GetSourcePartNumber(int lessonId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var qdtLlLessonItem = db.qdt_ll_lesson_item.Where(n => n.lesson_id == lessonId).ToList();
                return this.DirectSuccess(qdtLlLessonItem);
            }
        }

        [DirectInclude]
        public ActionResult GetRestrictItem(int lessionId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                //string status_string = OperationLessonStatus.Active.ToLowerString();
                var restrictItem =
                    db.qdt_tq_operational_restriction.Where(
                        n => n.certification_item_id == lessionId)
                       .ToList();
                return this.DirectSuccess(restrictItem);
            }
        }


        #region category CRUD

        [DirectInclude]
        public ActionResult CreateCategory(qdt_ll_category entry)
        {
            using (QDTEntities db = new QDTEntities())
            {
                if (db.qdt_ll_category.Any(n => n.category.ToLower().Equals(entry.category.ToLower())))
                {
                    return DirectFailure("类别已经存在");
                }
                else
                {
                    db.qdt_ll_category.AddObject(entry);
                    db.SaveChanges();
                    return DirectSuccess();
                }
            }
        }




        [DirectInclude]
        public ActionResult UpdateCategory(qdt_ll_category entry)
        {
            using (QDTEntities db = new QDTEntities())
            {
                if (
                    db.qdt_ll_category.Any(
                        n => n.category.ToLower().Equals(entry.category.ToLower()) && n.id != entry.id))
                {
                    return DirectFailure("类别已经存在");
                }
                else
                {
                    db.qdt_ll_category.Single(n => n.id == entry.id).category = entry.category.Trim();
                    db.SaveChanges();
                    return DirectSuccess();
                }
            }
        }

        [DirectInclude]
        public ActionResult DeleteCategory(int id)
        {
            using (QDTEntities db = new QDTEntities())
            {
                if (db.qdt_ll_category.Any(n => n.id == id))
                {
                    db.qdt_ll_category.DeleteObject(db.qdt_ll_category.Single(n => n.id == id));
                    db.SaveChanges();
                }
                return DirectSuccess();
            }
        }

        #endregion


        #region lesson CRUD

        public List<Lesson> GetAllLessons()
        {

            using (QDTEntities db = new QDTEntities())
            {
                string active = LessonStatus.Active.ToLowerString();
                var lessons = (from l in db.qdt_ll_lesson
                               join c in db.qdt_ll_category on l.category_id equals c.id

                               where l.status.Equals(active)

                               select new Lesson()
                               {
                                   id = l.id,
                                   category_id = l.category_id,
                                   subject = l.subject,
                                   detail = l.detail,

                                   owner_id = l.owner_id,
                                   business = l.business,

                                   restrict_all = l.restrict_all,

                                   create_by = l.create_by,
                                   create_date = l.create_date,

                                   working_group = l.working_group,

                                   effective_time = l.effective_time,
                                   status = l.status,

                                   skill_code_binding_mode = l.skill_code_binding_mode,
                                   failure_mode = l.failure_mode,
                                   learning_cycle = l.learning_cycle

                               }).ToList();
                foreach (var lesson in lessons)
                {
                    lesson.attachment_quantity = Attachment.GetAttachmentQuantity("lesson", lesson.id.ToString());
                }
                return lessons;
            }
        }

        [DirectInclude]
        public ActionResult GetLessons(JObject o)
        {
            var searchConditions = o["search_conditions"];

            var lessons = GetAllLessons();
            if (searchConditions == null)
            {
                return DirectSuccess(PagedData(o, lessons.AsQueryable()), lessons.Count());
            }

            string workingGroup = searchConditions["working_group"].Value<string>();
            string partNum = searchConditions["part_num"].Value<string>();
            string business = searchConditions["business"].Value<string>();

            string subject = searchConditions["subject"].Value<string>();

            int categoryId = searchConditions["category_id"].Value<string>() != "" ? searchConditions["category_id"].Value<int>() : 0;
            int ownerId = searchConditions["owner_id"].Value<string>() != "" ? searchConditions["owner_id"].Value<int>() : 0;
            int createById = searchConditions["create_by_id"].Value<string>() != "" ? searchConditions["create_by_id"].Value<int>() : 0;


            if (!workingGroup.Equals("") && !workingGroup.Equals("0"))
            {
                lessons = lessons.Where(n => n.working_group.Substring(1, n.working_group.Length - 2).Replace("},{", ",").Split(',').Contains(workingGroup)).ToList();
            }

            if (!partNum.Equals(""))
            {

                using (QDTEntities db = new QDTEntities())
                {
                    lessons = (from l in db.qdt_ll_lesson
                               join li in db.qdt_ll_lesson_item on l.id equals li.lesson_id into temp
                               from t in temp.DefaultIfEmpty()
                               where t.item.Equals(partNum)
                               select new Lesson()
                               {
                                   id = l.id,
                                   category_id = l.category_id,
                                   subject = l.subject,
                                   detail = l.detail,

                                   owner_id = l.owner_id,
                                   business = l.business,

                                   restrict_all = l.restrict_all,

                                   create_by = l.create_by,
                                   create_date = l.create_date,

                                   working_group = l.working_group,

                                   effective_time = l.effective_time,
                                   status = l.status,

                                   failure_mode = l.failure_mode,
                                   learning_cycle = l.learning_cycle,
                                   skill_code_binding_mode = l.skill_code_binding_mode

                               }).ToList();
                }

            }

            if (!business.Equals(""))
            {
                lessons = lessons.Where(n => n.business.Equals(business)).ToList();
            }

            if (!subject.Equals(""))
            {
                lessons = lessons.Where(n => n.subject.ToLower().Contains(subject.ToLower())).ToList();
            }

            if (categoryId != 0)
            {
                lessons = lessons.Where(n => n.category_id == categoryId).ToList();
            }

            if (ownerId != 0)
            {
                lessons = lessons.Where(n => n.owner_id == ownerId).ToList();
            }

            if (createById != 0)
            {
                lessons = lessons.Where(n => n.create_by == createById).ToList();
            }

            return DirectSuccess(PagedData(o, lessons.AsQueryable()), lessons.Count());
        }

        //[DirectInclude]
        //[FormHandler]
        //public ActionResult SearchLessons(JObject o)
        //{

        //    var form = Request.Form;
        //    string workingGroup = form["working_group"];
        //    string partNum = form["part_num"];
        //    string business = form["business"];

        //    string subject = form["subject"];


        //    int categoryId = Convert.ToInt32(form["category_id"].Equals("") ? "0" : form["category_id"]);
        //    int employeeId = Convert.ToInt32(form["employee_id"].Equals("") ? "0" : form["employee_id"]);
        //    int createById = Convert.ToInt32(form["create_by_id"].Equals("") ? "0" : form["create_by_id"]);

        //    var lessons = GetAllLessons();

        //    if (!workingGroup.Equals("") && !workingGroup.Equals("0"))
        //    {
        //        lessons = lessons.Where(n => n.working_group.Substring(1, n.working_group.Length - 2).Replace("},{", ",").Split(',').Contains(workingGroup)).ToList();
        //    }

        //    if (!partNum.Equals(""))
        //    {

        //        using (QDTEntities db = new QDTEntities())
        //        {
        //            lessons = (from l in db.qdt_ll_lesson
        //                       join li in db.qdt_ll_lesson_item on l.id equals li.lesson_id into temp
        //                       from t in temp.DefaultIfEmpty()
        //                       where t.item.Equals(partNum)
        //                       select new Lesson()
        //                           {
        //                               id = l.id,
        //                               category_id = l.category_id,
        //                               subject = l.subject,
        //                               detail = l.detail,

        //                               owner_id = l.owner_id,
        //                               business = l.business,

        //                               restrict_all = l.restrict_all,

        //                               create_by = l.create_by,
        //                               create_date = l.create_date,

        //                               working_group = l.working_group,

        //                               effective_time = l.effective_time,
        //                               status = l.status,

        //                           }).ToList();
        //        }

        //    }

        //    if (!business.Equals(""))
        //    {
        //        lessons = lessons.Where(n => n.business.Equals(business)).ToList();
        //    }

        //    if (!subject.Equals(""))
        //    {
        //        lessons = lessons.Where(n => n.subject.ToLower().Contains(subject.ToLower())).ToList();
        //    }

        //    if (categoryId != 0)
        //    {
        //        lessons = lessons.Where(n => n.category_id == categoryId).ToList();
        //    }

        //    if (employeeId != 0)
        //    {
        //        lessons = lessons.Where(n => n.owner_id == employeeId).ToList();
        //    }

        //    if (createById != 0)
        //    {
        //        lessons = lessons.Where(n => n.create_by == createById).ToList();
        //    }

        //    return DirectSuccess(lessons);
        //}


        [ValidateInput(false)]
        [FormHandler]
        [DirectInclude]
        public ActionResult SaveLesson()
        {
            //return actual id if created
            // return DirectSuccess();
            var form = Request.Form;
            string saveMode = form["save_mode"];
            if (saveMode.Equals(SaveMode.Add.ToLowerString()))
            {
                using (QDTEntities db = new QDTEntities())
                {
                    string id = form["id"];
                    var dummyId = DummyIdRepository.Items.Single(n => n.SessionID == Session.SessionID);
                    string business = form["business"];
                    int categoryId = Convert.ToInt32(form["category_id"]);
                    int createBy = GetSessionUserId();
                    int ownerId = Convert.ToInt32(form["owner_id"]);
                    string subject = form["subject"];
                    //string detail = HttpUtility.HtmlEncode(form["detail"]);
                    //'detail' already been html encoded
                    string detail = form["detail"];
                    int effectiveTime = Convert.ToInt32(form["effective_time"]);
                    string workingGroup = "{" + form["working_group"].Replace(",", "},{") + "}";
                    bool restrictAll = form["restrict_all"] != null && form["restrict_all"].Equals("on");
                    int failureMode = Convert.ToInt32(form["failure_mode"]);
                    int learningCycle = Convert.ToInt32(form["learning_cycle"]);
                    string skillCodeBindingMode = form["skill_code_binding_mode"];


                    string sourcePartNum = form["source_part_num"].Equals("") ? null : form["source_part_num"];
                    int? sourceOperationNum = null;
                    if (form["source_oper_num"] != null && !form["source_oper_num"].Equals(""))
                    {
                        sourceOperationNum = Convert.ToInt32(form["source_oper_num"]);
                    }

                    var lesson = new qdt_ll_lesson()
                    {
                        business = business,
                        category_id = categoryId,
                        create_by = createBy,
                        create_date = DateTime.Now,
                        detail = detail,
                        owner_id = ownerId,
                        subject = subject,
                        effective_time = effectiveTime,
                        working_group = workingGroup,
                        restrict_all = restrictAll,
                        status = LessonStatus.Active.ToLowerString(),
                        failure_mode = failureMode,
                        learning_cycle = learningCycle,
                        skill_code_binding_mode = skillCodeBindingMode
                    };
                    db.qdt_ll_lesson.AddObject(lesson);
                    db.SaveChanges();


                    if (sourcePartNum != null)
                    {
                        var qdtLlLessonItem = new qdt_ll_lesson_item()
                        {
                            lesson_id = lesson.id,
                            item = sourcePartNum,
                            operation = sourceOperationNum,
                            row_pointer = Guid.NewGuid()
                        };
                        db.qdt_ll_lesson_item.AddObject(qdtLlLessonItem);
                    }

                    //   bool restrictRun = form["restrict_run"] != null && form["res   trict_run"].Equals("on");
                    //   string partNum = form["part_num"];
                    //if (restrictRun == true)
                    //{

                    //    var operationalRestriction = new qdt_tq_operational_restriction()
                    //    {

                    //        item = partNum,
                    //        oper_num = null,
                    //        operation_id = null,
                    //        work_type = WorkType.RUN.ToLowerString(),
                    //        certification_category = CertificationCategory.LLC.ToLowerString(),
                    //        certification_item_id = lesson.id,
                    //        row_pointer = Guid.NewGuid()
                    //    };
                    //    db.qdt_tq_operational_restriction.AddObject(operationalRestriction);
                    //}
                    db.SaveChanges();

                    string fileBaesDirectory = GetFileSaveDirectoryBase(AttachmentDirectories["lesson"]),
                        sourceDir = Path.Combine(fileBaesDirectory, id),
                        destDir = Attachment.ReplaceDummyPath(sourceDir, dummyId.Id, lesson.id.ToString());
                    if (Directory.Exists(sourceDir))
                    {
                        Directory.Move(sourceDir, destDir);
                        foreach (var reference in db.sys_attachment_ref.Where(n => n.ref_num == id))
                        {
                            reference.ref_num = lesson.id.ToString();
                            foreach (
                                var attachment in
                                    db.sys_attachment.Where(n => n.attachment_id == reference.attachment_id))
                            {
                                attachment.file_path = Attachment.ReplaceDummyPath(attachment.file_path, dummyId.Id,
                                    lesson.id.ToString());
                            }
                        }

                        db.SaveChanges();

                    }
                    DummyIdRepository.Remove(dummyId.Id);
                    return DirectSuccess();
                }


            }
            else if (saveMode.Equals(SaveMode.Edit.ToLowerString()))
            {
                using (QDTEntities db = new QDTEntities())
                {
                    int id = Convert.ToInt32((form["id"]));
                    string business = form["business"];
                    int categoryId = Convert.ToInt32(form["category_id"]);
                    int updateBy = GetSessionUserId();
                    int ownerId = Convert.ToInt32(form["owner_id"]);
                    string subject = form["subject"];
                    //string detail = HttpUtility.HtmlEncode(form["detail"]);
                    //'detail' already been html encoded
                    string detail = form["detail"];
                    int effectiveTime = Convert.ToInt32(form["effective_time"]);
                    string workingGroup = "{" + form["working_group"].Replace(",", "},{") + "}";
                    bool restrictAll = form["restrict_all"] != null && form["restrict_all"].Equals("on");
                    //bool restrictRun = form["restrict_run"] != null && form["restrict_run"].Equals("on");
                    //   string partNum = form["part_num"];

                    string sourcePartNum = form["source_part_num"].Equals("") ? null : form["source_part_num"];
                    int? sourceOperationNum = null;
                    if (form["source_oper_num"] != null && !form["source_oper_num"].Equals(""))
                    {
                        sourceOperationNum = Convert.ToInt32(form["source_oper_num"]);
                    }

                    int failureMode = Convert.ToInt32(form["failure_mode"]);
                    int learningCycle = Convert.ToInt32(form["learning_cycle"]);
                    string skillCodeBindingMode = form["skill_code_binding_mode"];



                    var lesson = db.qdt_ll_lesson.Single(n => n.id == id);
                    lesson.business = business;
                    lesson.category_id = categoryId;
                    lesson.update_by = updateBy;
                    lesson.update_date = DateTime.Now;
                    lesson.detail = detail;
                    lesson.owner_id = ownerId;
                    lesson.subject = subject;
                    lesson.effective_time = effectiveTime;
                    lesson.working_group = workingGroup;
                    lesson.restrict_all = restrictAll;
                    lesson.status = LessonStatus.Active.ToLowerString();
                    lesson.failure_mode = failureMode;
                    lesson.learning_cycle = learningCycle;
                    lesson.skill_code_binding_mode = skillCodeBindingMode;

                    db.SaveChanges();



                    var qdtLlLessonItems = db.qdt_ll_lesson_item.Where(n => n.lesson_id == id).ToList();
                    foreach (var qdtLlLessonItem in qdtLlLessonItems)
                    {
                        db.qdt_ll_lesson_item.DeleteObject(qdtLlLessonItem);
                        db.SaveChanges();
                    }
                    if (sourcePartNum != null)
                    {
                        var qdtLlLessonItem = new qdt_ll_lesson_item()
                        {
                            lesson_id = lesson.id,
                            item = sourcePartNum,
                            operation = sourceOperationNum,
                            row_pointer = Guid.NewGuid()
                        };
                        db.qdt_ll_lesson_item.AddObject(qdtLlLessonItem);
                    }

                    //var operationalRestrictions = db.qdt_tq_operational_restriction.Where(n => n.certification_item_id == id).ToList();
                    //foreach (var operationalRestriction in operationalRestrictions)
                    //{
                    //    db.qdt_tq_operational_restriction.DeleteObject(operationalRestriction);
                    //    db.SaveChanges();
                    //}


                    //if (restrictRun == true)
                    //{

                    //    var operationalRestriction = new qdt_tq_operational_restriction()
                    //    {
                    //        item = partNum,
                    //        oper_num = null,
                    //        operation_id = null,
                    //        work_type = WorkType.RUN.ToLowerString(),
                    //        certification_category = CertificationCategory.LLC.ToLowerString(),
                    //        certification_item_id = lesson.id,
                    //        row_pointer = Guid.NewGuid()
                    //    };
                    //    db.qdt_tq_operational_restriction.AddObject(operationalRestriction);
                    //}

                    db.SaveChanges();


                    return DirectSuccess();
                }
            }
            else
            {
                return DirectFailure("Save Mode is not correct!");
            }
        }


        [DirectInclude]
        public ActionResult InactiveLesson(int lessonId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var lesson = db.qdt_ll_lesson.Single(n => n.id == lessonId);
                lesson.status = LessonStatus.Inactive.ToLowerString();
                db.SaveChanges();
            }
            return DirectSuccess();
        }





        #endregion


        #region  Training Related


        private List<Training> getAllPendingLlTrainings()
        {
            string pendingS = CertificationStatus.Pending.ToLowerString();
            using (QDTEntities db = new QDTEntities())
            {
                string category = CertificationCategory.LLC.ToLowerString();

                var llTrainings = (from qtc in db.qdt_tq_certification
                                   join qll in db.qdt_ll_lesson on qtc.certification_item_id equals qll.id
                                   join qwr in db.qdt_workflow_request on qtc.request_id equals qwr.id
                                   join li in db.qdt_ll_lesson_item on qll.id equals li.lesson_id into temp
                                  from t in temp.DefaultIfEmpty()
                                   join qwro in db.qdt_workflow_route on
                                       new { workflow_id = (int)qwr.workflow_id, current_step = (int)qwr.current_step } equals
                                       new { workflow_id = qwro.workflow_id, current_step = qwro.step }
                                   join qwp in db.qdt_workflow_process on
                                       new { request_id = qwr.id, current_step = (int)qwr.current_step } equals
                                       new { request_id = qwp.request_id, current_step = qwp.step }
                                   where qtc.category.Equals(category)
                                   //&& qwr.current_step == qwa.step   
                                   select new Training
                                   {
                                       certification_id = qtc.id,
                                       lesson_id = qtc.certification_item_id,
                                       request_id = qtc.request_id,
                                       employee_id = qtc.employee_id,
                                       current_process_id = qwp.id,
                                       subject = qll.subject,
                                       detail = qll.detail,
                                       category_id = qll.category_id,
                                       business = qll.business,
                                       start_time = qwr.start_time,
                                       due_date = qwr.due_date,
                                       requestor = qwr.requestor,
                                       request_for = qwr.request_for,
                                       owner_id = qll.owner_id,
                                       restrict_all = qll.restrict_all,
                                       working_group = qll.working_group,
                                       effective_time = qll.effective_time,
                                       status = qtc.status,
                                       current_step = qtc.status.Equals(pendingS) ? qwro.step : -1,
                                       current_step_name = qtc.status.Equals(pendingS) ? qwro.name : "",
                                       part_num = (t != null ? t.item : "")
                                   }).ToList();
                return llTrainings;
            }

        }




        //这个方法被我的培训和学习列表两个功能调用，通过isAll参数来分别。
        [DirectInclude]
        public ActionResult GetLlTrainings(JObject o)
        {
            //o中的参数
            //isAll表示是否查询某个人的

            string pendingS = CertificationStatus.Pending.ToLowerString();
            var llTrainings = getAllPendingLlTrainings();
            int employeeId = VmNativeUser.GetEmployeeIdByUserId(GetCurrentUser().user_id);

           

            if (!o["isAll"].Value<bool>())
            {
                llTrainings = llTrainings.Where(n => n.request_for == employeeId).ToList();

                
            }

            var searchConditions = o["search_conditions"];
            if (searchConditions != null)
            {
                string workingGroup = searchConditions["working_group"].Value<string>();
                string partNum = searchConditions["part_num"].Value<string>();
                string business = searchConditions["business"].Value<string>();

                string subject = searchConditions["subject"].Value<string>();


                int categoryId = searchConditions["category_id"].Value<string>() != "" ? searchConditions["category_id"].Value<int>() : 0;
                int ownerId = searchConditions["owner_id"].Value<string>() != "" ? searchConditions["owner_id"].Value<int>() : 0;
                int requestor = searchConditions["requestor"].Value<string>() != "" ? searchConditions["requestor"].Value<int>() : 0;
                int trainee = searchConditions["request_for"].Value<string>() != "" ? searchConditions["request_for"].Value<int>() : 0;

                bool expiredTraining = searchConditions["expired_training"].Value<string>() == "on" ? true : false;

                DateTime? dueDateStart = searchConditions["due_date_start"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["due_date_start"].Value<string>()).Year,
                Convert.ToDateTime(searchConditions["due_date_start"].Value<string>()).Month,
                Convert.ToDateTime(searchConditions["due_date_start"].Value<string>()).Day, 0, 0, 0);

                DateTime? dueDateEnd = searchConditions["due_date_end"].Value<string>() == "" ? null : (DateTime?)new DateTime(Convert.ToDateTime(searchConditions["due_date_end"].Value<string>()).Year,
              Convert.ToDateTime(searchConditions["due_date_end"].Value<string>()).Month,
              Convert.ToDateTime(searchConditions["due_date_end"].Value<string>()).Day, 0, 0, 0);


                if (!workingGroup.Equals("") && !workingGroup.Equals("0"))
                {
                    llTrainings = llTrainings.Where(n => n.working_group.Substring(1, n.working_group.Length - 2).Replace("},{", ",").Split(',').Contains(workingGroup)).ToList();
                }



                if (expiredTraining)
                {
                    llTrainings = llTrainings.Where(n => n.due_date < System.DateTime.Now).ToList();
                }

                if (dueDateStart != null)
                {
                    llTrainings = llTrainings.Where(n => n.due_date >= dueDateStart).ToList();
                }

                if (dueDateEnd != null)
                {
                    llTrainings = llTrainings.Where(n => n.due_date <= dueDateEnd).ToList();

                }

                if (!partNum.Equals(""))
                {
                    llTrainings = llTrainings.Where(n => n.part_num.Equals(partNum)).ToList();
                }

                if (!business.Equals(""))
                {
                    llTrainings = llTrainings.Where(n => n.business.Equals(business)).ToList();
                }

                if (!subject.Equals(""))
                {
                    llTrainings = llTrainings.Where(n => n.subject.ToLower().Contains(subject.ToLower())).ToList();
                }

                if (categoryId != 0)
                {
                    llTrainings = llTrainings.Where(n => n.category_id == categoryId).ToList();
                }

                if (ownerId != 0)
                {
                    llTrainings = llTrainings.Where(n => n.owner_id == ownerId).ToList();
                }

                if (requestor != 0)
                {
                    llTrainings = llTrainings.Where(n => n.requestor == requestor).ToList();
                }

                if (trainee != 0)
                {
                    llTrainings = llTrainings.Where(n => n.employee_id == trainee).ToList();
                }


                using (QDTEntities db = new QDTEntities())
                {



                    foreach (var llTraining in llTrainings)
                    {
                        llTraining.attachment_quantity = Attachment.GetAttachmentQuantity("lesson",
                            llTraining.lesson_id.ToString());

                        if (llTraining.status.Equals(pendingS))
                        {
                            var approvers =
                                db.qdt_workflow_approver.Where(
                                    n => n.request_id == llTraining.request_id && n.step == llTraining.current_step)
                                    .ToList();
                            string approversS = "";
                            foreach (var approver in approvers)
                            {
                                approversS += approver.approver_id + ",";
                            }
                            llTraining.current_approvers = approversS;

                        }
                    }

                }
            }

            using (QDTEntities db = new QDTEntities())
            {
                llTrainings = (from lt in llTrainings
                               join l in db.qdt_ll_lesson on lt.lesson_id equals l.id
                               join qwr in db.qdt_workflow_request on lt.request_id equals qwr.id
                               join li in db.qdt_ll_lesson_item on l.id equals li.lesson_id into temp
                               from t in temp.DefaultIfEmpty()
                               join qwro in db.qdt_workflow_route on
                                             new { workflow_id = (int)qwr.workflow_id, current_step = (int)qwr.current_step } equals
                                             new { workflow_id = qwro.workflow_id, current_step = qwro.step }
                               select new Training()
                               {
                                   certification_id = lt.certification_id,
                                   lesson_id = lt.lesson_id,
                                   request_id = lt.request_id,
                                   employee_id = lt.employee_id,
                                   current_process_id = lt.current_process_id,
                                   subject = lt.subject,
                                   detail = lt.detail,
                                   category_id = lt.category_id,
                                   business = lt.business,
                                   start_time = lt.start_time,
                                   due_date = qwr.due_date,
                                   requestor = lt.requestor,
                                   request_for = lt.request_for,
                                   owner_id = lt.owner_id,
                                   restrict_all = lt.restrict_all,
                                   working_group = lt.working_group,
                                   effective_time = lt.effective_time,
                                   status = lt.status.Equals("active") ? "finished" : lt.status,
                                   current_step = lt.status.Equals(pendingS) ? qwro.step : -1,
                                   current_step_name = lt.status.Equals(pendingS) ? qwro.name : "",
                                   part_num = (t != null ? t.item : "")
                               }
                    ).ToList();
            }

            return DirectSuccess(PagedData(o, llTrainings.AsQueryable()), llTrainings.Count());
        }


        [DirectInclude]
        [FormHandler]
        public ActionResult SearchLlTrainings()
        {

            var form = Request.Form;
            string workingGroup = form["working_group"];
            string partNum = form["part_num"];
            string business = form["business"];

            string subject = form["subject"];


            int categoryId = Convert.ToInt32(form["category_id"].Equals("") ? "0" : form["category_id"]);
            int employeeId = Convert.ToInt32(form["employee_id"].Equals("") ? "0" : form["employee_id"]);
            int requestor = Convert.ToInt32(form["requestor"].Equals("") ? "0" : form["requestor"]);

            var llTrainings = getAllPendingLlTrainings();

            if (!workingGroup.Equals("") && !workingGroup.Equals("0"))
            {
                llTrainings = llTrainings.Where(n => n.working_group.Substring(1, n.working_group.Length - 2).Replace("},{", ",").Split(',').Contains(workingGroup)).ToList();
            }

            if (!partNum.Equals(""))
            {
                using (QDTEntities db = new QDTEntities())
                {
                    string pendingS = CertificationStatus.Pending.ToLowerString();
                    llTrainings = (from lt in llTrainings
                                   join l in db.qdt_ll_lesson on lt.lesson_id equals l.id
                                   join qwr in db.qdt_workflow_request on lt.request_id equals qwr.id
                                   join li in db.qdt_ll_lesson_item on l.id equals li.lesson_id into temp
                                   from t in temp.DefaultIfEmpty()
                                   join qwro in db.qdt_workflow_route on
                                                 new { workflow_id = (int)qwr.workflow_id, current_step = (int)qwr.current_step } equals
                                                 new { workflow_id = qwro.workflow_id, current_step = qwro.step }
                                   where t.item.Equals(partNum)
                                   select new Training()
                                   {
                                       certification_id = lt.certification_id,
                                       lesson_id = lt.lesson_id,
                                       request_id = lt.request_id,
                                       employee_id = lt.employee_id,
                                       current_process_id = lt.current_process_id,
                                       subject = lt.subject,
                                       detail = lt.detail,
                                       category_id = lt.category_id,
                                       business = lt.business,
                                       start_time = lt.start_time,
                                       requestor = lt.requestor,
                                       request_for = lt.request_for,
                                       owner_id = lt.owner_id,
                                       restrict_all = lt.restrict_all,
                                       working_group = lt.working_group,
                                       effective_time = lt.effective_time,
                                       status = lt.status,
                                       current_step = lt.status.Equals(pendingS) ? qwro.step : -1,
                                       current_step_name = lt.status.Equals(pendingS) ? qwro.name : "",
                                   }
                        ).ToList();
                }
            }

            if (!business.Equals(""))
            {
                llTrainings = llTrainings.Where(n => n.business.Equals(business)).ToList();
            }

            if (!subject.Equals(""))
            {
                llTrainings = llTrainings.Where(n => n.subject.ToLower().Contains(subject.ToLower())).ToList();
            }

            if (categoryId != 0)
            {
                llTrainings = llTrainings.Where(n => n.category_id == categoryId).ToList();
            }

            if (employeeId != 0)
            {
                llTrainings = llTrainings.Where(n => n.owner_id == employeeId).ToList();
            }

            if (requestor != 0)
            {
                llTrainings = llTrainings.Where(n => n.requestor == requestor).ToList();
            }

            //if (o["business"] != null && o["business"].Value<string>() != null && !o["business"].Value<string>().Equals(""))
            //{
            //    llTrainings = llTrainings.Where(n => n.business.Equals(o["business"].Value<string>())).ToList();
            //}
            //if (o["trainee"] != null && o["trainee"].Value<string>() != null && !o["trainee"].Value<string>().Equals(""))
            //{
            //    llTrainings = llTrainings.Where(n => n.request_for == o["trainee"].Value<int>()).ToList();
            //}
            //if (o["creator"] != null && o["creator"].Value<string>() != null && !o["creator"].Value<string>().Equals(""))
            //{
            //    llTrainings = llTrainings.Where(n => n.requestor == o["creator"].Value<int>()).ToList();
            //}
            return DirectSuccess(llTrainings);
        }

        [DirectInclude]
        public ActionResult GetTrainingsNeedApprove()
        {

            return DirectSuccess();

        }


        [DirectInclude]
        public ActionResult CreateTraining(int lessonId, List<hr_employee> trainees)
        {
            //TODO: 部分代码可以使用workflow.cs中的新建request或者certification方法
            var workflowId = 5;
            var createTime = System.DateTime.Now;
            using (QDTEntities db = new QDTEntities())
            {
                var workFlow = db.qdt_workflow.Single(n => n.id == workflowId);
                var lesson = db.qdt_ll_lesson.Single(n => n.id == lessonId);
                foreach (var trainee in trainees)
                {
                    var request = new qdt_workflow_request()
                    {
                        workflow_id = workflowId,
                        requestor = this.GetCurrentUser().user_id, //user_id
                        request_for = trainee.employee_id, //employee_id
                        due_date = System.DateTime.Now.AddDays((double)workFlow.lead_time), //plus lead_time
                        status = WorkflowRequestStatus.Open.ToLowerString(),
                        start_time = createTime,
                        current_step = 0
                    };
                    db.qdt_workflow_request.AddObject(request);
                    db.SaveChanges();

                    var certification = new qdt_tq_certification()
                    {
                        category = workFlow.category,
                        employee_id = trainee.employee_id,
                        certification_item = lesson.subject,
                        certification_item_id = lesson.id,
                        request_id = request.id,
                        status = CertificationStatus.Pending.ToLowerString(),
                        certify_mode = CertifyMode.Normal.ToLowerString()
                    };
                    db.qdt_tq_certification.AddObject(certification);
                    db.SaveChanges();


                    var workflowAction = new qdt_workflow_action()
                    {
                        action_target = WorkflowActionTarget.Request.ToLowerString(),
                        target_id = request.id,
                        process_action = WorkflowActionType.Create.ToLowerString(),
                        handler = this.GetCurrentUser().user_id,
                        process_time = createTime,
                        remark = null
                    };
                    db.qdt_workflow_action.AddObject(workflowAction);

                    var steps = db.qdt_workflow_route.Where(n => n.workflow_id == workflowId).ToList();
                    for (int i = 0; i < steps.Count; i++)
                    {
                        var process = new qdt_workflow_process()
                           {
                               request_id = request.id,
                               step = steps[i].step,
                               name = steps[i].name
                           };
                        if (i == 0)
                        {
                            process.start_time = createTime;
                            process.status = WorkflowProcessStatus.Pending.ToLowerString();
                        }
                        else
                        {
                            process.status = WorkflowProcessStatus.Open.ToLowerString();

                        }
                        db.qdt_workflow_process.AddObject(process);
                        db.SaveChanges();
                    }


                    var step0Approver = new qdt_workflow_approver()
                    {
                        workflow_id = workflowId,
                        request_id = request.id,
                        step = 0,
                        approver_id = VmNativeUser.GetUserIdByEmployeeId(trainee.employee_id)
                    };
                    db.qdt_workflow_approver.AddObject(step0Approver);
                    db.SaveChanges();

                    object[] args = new object[2];
                    args[0] = certification.id;
                    args[1] = db.qdt_workflow_process.Single(n => n.request_id == request.id && n.step == 0).id;
                    HtmlMailController.SendNotification(EmailType.QdtLlCertificationCreated, args);
                }
            }

            return this.DirectSuccess();
        }


        //[DirectInclude]
        //public ActionResult CreateTraining(int lessonId, List<hr_employee> trainees, List<hr_employee> approvers)
        //{
        //    //TODO: 部分代码可以使用workflow.cs中的新建request或者certification方法
        //    var workflowId = 5;
        //    var createTime = System.DateTime.Now;
        //    using (QDTEntities db = new QDTEntities())
        //    {
        //        var workFlow = db.qdt_workflow.Single(n => n.id == workflowId);
        //        var lesson = db.qdt_ll_lesson.Single(n => n.id == lessonId);
        //        foreach (var trainee in trainees)
        //        {
        //            var request = new qdt_workflow_request()
        //            {
        //                workflow_id = workflowId,
        //                requestor = this.GetCurrentUser().user_id, //user_id
        //                request_for = trainee.employee_id, //employee_id
        //                due_date = System.DateTime.Now.AddDays((double)workFlow.lead_time), //plus lead_time
        //                status = WorkflowRequestStatus.Open.ToLowerString(),
        //                start_time = createTime,
        //                current_step = 0
        //            };
        //            db.qdt_workflow_request.AddObject(request);
        //            db.SaveChanges();

        //            var certification = new qdt_tq_certification()
        //            {
        //                category = workFlow.category,
        //                employee_id = trainee.employee_id,
        //                certification_item = lesson.subject,
        //                certification_item_id = lesson.id,
        //                request_id = request.id,
        //                status = CertificationStatus.Pending.ToLowerString(),
        //                certify_mode = CertifyMode.Normal.ToLowerString()
        //            };
        //            db.qdt_tq_certification.AddObject(certification);
        //            db.SaveChanges();


        //            var workflowAction = new qdt_workflow_action()
        //            {
        //                action_target = WorkflowActionTarget.Request.ToLowerString(),
        //                target_id = request.id,
        //                process_action = WorkflowActionType.Create.ToLowerString(),
        //                handler = this.GetCurrentUser().user_id,
        //                process_time = createTime,
        //                remark = null
        //            };
        //            db.qdt_workflow_action.AddObject(workflowAction);

        //            var steps = db.qdt_workflow_route.Where(n => n.workflow_id == workflowId).ToList();
        //            for (int i = 0; i < steps.Count; i++)
        //            {
        //                var process = new qdt_workflow_process()
        //                   {
        //                       request_id = request.id,
        //                       step = steps[i].step,
        //                       name = steps[i].name
        //                   };
        //                if (i == 0)
        //                {
        //                    process.start_time = createTime;
        //                    process.status = WorkflowProcessStatus.Pending.ToLowerString();
        //                }
        //                else
        //                {
        //                    process.status = WorkflowProcessStatus.Open.ToLowerString();

        //                }
        //                db.qdt_workflow_process.AddObject(process);
        //                db.SaveChanges();
        //            }


        //            var step0Approver = new qdt_workflow_approver()
        //            {
        //                workflow_id = workflowId,
        //                request_id = request.id,
        //                step = 0,
        //                approver_id = VmNativeUser.GetUserIdByEmployeeId(trainee.employee_id)
        //            };
        //            db.qdt_workflow_approver.AddObject(step0Approver);
        //            db.SaveChanges();

        //            foreach (var approver in approvers)
        //            {
        //                var workflowApprover = new qdt_workflow_approver()
        //                {
        //                    workflow_id = workflowId,
        //                    request_id = request.id,
        //                    step = 1,
        //                    approver_id = VmNativeUser.GetUserIdByEmployeeId(approver.employee_id)
        //                };
        //                db.qdt_workflow_approver.AddObject(workflowApprover);
        //                db.SaveChanges();
        //            }

        //            var processId = db.qdt_workflow_process.Single(n => n.request_id == request.id && n.step == 0).id;

        //            object[] args = new object[2];
        //            args[0] = certification.id;
        //            args[1] = db.qdt_workflow_process.Single(n => n.request_id == request.id && n.step == 0).id;
        //            HtmlMailController.SendNotification(EmailType.QdtLlCertificationCreated, args);
        //        }
        //    }

        //    return this.DirectSuccess();
        //}


        [DirectInclude]
        public ActionResult FinishTraining(int currentProcessId, string remark)
        {

            //  int handler = VmNativeUser.GetEmployeeIdByUserId(this.GetCurrentUser().user_id);
            int approverId = this.GetCurrentUser().user_id;
            bool approveResult = Workflow.ApproveWorkflowProcess(currentProcessId, approverId, remark);

            return this.Direct(new
            {
                success = true,
                approve_result = approveResult
            });

            //var process = db.qdt_workflow_process.Single(n => n.request_id == requestId && n.status.Equals(WorkflowProcessStatus.Pending.ToLowerString()));
            //process.end_time = submitTime;
            //db.SaveChanges();

            //var action = new qdt_workflow_action()
            //{
            //    action_target = "process",
            //    target_id = process.id,
            //    process_action = "submit training",
            //    handler = this.GetCurrentUser().user_id,
            //    process_time = submitTime,
            //    remark = remark
            //};

            //db.qdt_workflow_action.AddObject(action);
            //db.SaveChanges();


        }

        #endregion

        #region Check  Approver

        [DirectInclude]
        public ActionResult CheckApprover(int currentProcessId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var approvers = Workflow.GetApproverByProcessId(currentProcessId);
                int currentUserId = GetCurrentUser().user_id;
                bool isApprover = approvers.Any(n => n.approver_id == currentUserId);

                return this.Direct(new
                {
                    success = true,
                    isApprover = isApprover
                });
            }
        }

        #endregion

        [DirectInclude]
        public ActionResult GetFailureModes()
        {
            using (QDTEntities db = new QDTEntities())
            {
                var modes = db.qdt_ll_failure_mode.Where(n => n.is_active == true).ToList();
                return DirectSuccess(modes);
            }
        }

        [DirectInclude]
        public ActionResult GetFailureMode()
        {
            using (QDTEntities db = new QDTEntities())
            {
                var modes = db.qdt_ll_failure_mode.ToList();
                return DirectSuccess(modes);
            }
        }

        public void PrintLesson(int lessonId)
        {
            using (QDTEntities db = new QDTEntities())
            {

                if (db.qdt_ll_lesson.Any(n => n.id == lessonId))
                {
                    var lesson = db.qdt_ll_lesson.Single(n => n.id == lessonId);
                    string partS;
                    string operS;
                    try
                    {
                        var part = db.qdt_ll_lesson_item.Single(n => n.lesson_id == lessonId);
                        partS = part.item;
                        operS = part.operation.Value.ToString();
                    }
                    catch
                    {
                         partS = "N/A";
                         operS = "N/A";
                    }
                  
                    var category = db.qdt_ll_category.Single(n => n.id == lesson.category_id);
                    var failureMode = db.qdt_ll_failure_mode.Single(n => n.mode_id == lesson.failure_mode);

                    string fileLocation = "/qdtLlPrints/";


                    //string path = @"\\TNWD07986\dr\";
                    string path = Server.MapPath(fileLocation); //map to the server path

                    string temploateFileName = "lessons learnt template.xls";

                    string reportFileName = lessonId + "_" +
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
                    IRow row1 = sheet1.GetRow(0);
                    IRow row2 = sheet1.GetRow(1);
                    IRow row3 = sheet1.GetRow(2);
                    IRow row4 = sheet1.GetRow(3);
                    IRow row5 = sheet1.GetRow(4);
                    IRow row6 = sheet1.GetRow(5);
                    IRow row7 = sheet1.GetRow(6);



                    ICell titleCell = row1.GetCell(0);
                    titleCell.SetCellValue("GE Aviation Suzhou - Quality Lesson #" + lesson.id);
                    titleCell.CellStyle.IsLocked = true;


                    ICell bussinessCell = row2.GetCell(1);
                    bussinessCell.SetCellValue(lesson.business);
                    bussinessCell.CellStyle.IsLocked = true;

                    ICell itemCell = row2.GetCell(3);
                    itemCell.SetCellValue(partS);
                    itemCell.CellStyle.IsLocked = true;

                    ICell categoryCell = row3.GetCell(1);
                    categoryCell.SetCellValue(category.category);
                    categoryCell.CellStyle.IsLocked = true;

                    ICell OPCell = row3.GetCell(3);
                    OPCell.SetCellValue(operS);
                    OPCell.CellStyle.IsLocked = true;

                    ICell ownerCell = row4.GetCell(1);
                    ownerCell.SetCellValue(VmNativeUser.GetNativeUserByEmployeeId(lesson.owner_id).name_cn);
                    ownerCell.CellStyle.IsLocked = true;

                    ICell creatorCell = row4.GetCell(3);
                    creatorCell.SetCellValue(VmNativeUser.GetNativeUserByUserId(lesson.create_by).name_cn);
                    creatorCell.CellStyle.IsLocked = true;

                    ICell failureModeCell = row5.GetCell(1);
                    failureModeCell.SetCellValue(failureMode.failure_mode_cn);
                    failureModeCell.CellStyle.IsLocked = true;

                    ICell createDateCell = row5.GetCell(3);
                    createDateCell.SetCellValue(lesson.create_date);
                    createDateCell.CellStyle.IsLocked = true;

                    ICell subjectCell = row6.GetCell(1);
                    subjectCell.SetCellValue(lesson.subject);
                    subjectCell.CellStyle.IsLocked = true;

                    ICell detailCell = row7.GetCell(1);
                    detailCell.SetCellValue(lesson.detail);
                    detailCell.CellStyle.IsLocked = true;
                 
                    sheet1.ProtectSheet("Pa55word");

                    FileStream wr = System.IO.File.Create(reportFilePath);

                    wk.Write(wr);

                    wr.Close();

                    FileHandler.DownloadFile(reportFilePath, reportFileName, Response, false);
                }
            }
        }
    }
}