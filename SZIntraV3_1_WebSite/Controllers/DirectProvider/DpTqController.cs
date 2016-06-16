using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;
using com.ge.szit.Suzhou_Intranet_V3.Utility;
using Common.Utility.Extension;
using Ext.Direct.Mvc;
using Newtonsoft.Json.Linq;
using ProductionManagement.Models.EntityModel;
using ProductionManagement.Models.Scan;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using SZIntraV3_1_WebSite.Models.System;
using SZIntraV3_1_WebSite.Models.Tq;
using SZIntraV3_1_WebSite.Utility;
using System.IO;
using SZIntraV3_1_WebSite.Models;
using System.Data.Objects;
using System.Web;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpTqController : QdtBaseController
    {

        //[DirectInclude]
        //public ActionResult test()
        //{
        //    using (QDTEntities db = new QDTEntities())
        //    {
        //        try
        //        {
        //             var trainerCertifications =
        //            db.qdt_tq_certification.Where(
        //                n =>
        //                    n.certification_item.Equals("C-SEG-A350") &&
        //                    n.certification_item_id == 1181).ToList();

        //            var x = trainerCertifications.Where(n =>n.expire_date.Value.AddDays((double) 365) > System.DateTime.Now).ToList();
        //        }
        //        catch (Exception e)
        //        {
        //            return DirectFailure(e);
        //        }
             
        //        return this.DirectSuccess();
        //    }
        //}

        [DirectInclude]
        public ActionResult ApproveProcess(int currentProcessId, string remark)
        {
            try
            {
                var userId = GetSessionUserId();
                Workflow.ApproveWorkflowProcess(currentProcessId, userId, remark);
                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        public ActionResult SendBackProcess(int requestId, string remark)
        {
            try
            {
                var userId = GetSessionUserId();
                if (Workflow.SendBackWorkflowProcess(requestId, userId, remark))
                {
                    return DirectSuccess();
                }
                else
                {
                    return DirectFailure("回退不成功，请检查是否是第一步?");
                }

            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        private bool IsValidCertificateTrainer(string category, int employeeId, int certificationItemId)
        {
            using (QDTEntities db = new QDTEntities())
            {

                string activeS = CertificationStatus.Active.ToLowerString();
                var result = db.qdt_tq_certification.Where(n => n.category.Equals(category) && n.employee_id == employeeId && n.certification_item_id == certificationItemId && (n.status.Equals(activeS)) && (n.is_trainer == null || n.is_trainer == false)).ToList();
                if (result.Count() == 0)
                {
                    return false;
                }
                else
                {
                    return true;
                }
            }
        }


        private bool IsValidCreateCertification(string category, int employeeId, int certificationItemId)
        {
            using (QDTEntities db = new QDTEntities())
            {


                string activeS = CertificationStatus.Active.ToLowerString();
                var result = db.qdt_tq_certification.Where(n => n.category.Equals(category) && n.employee_id == employeeId && n.certification_item_id == certificationItemId && (n.status.Equals(activeS))).ToList();
                if (result.Count() == 0)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }
        }

        private string GetCertificationItemByCertificationItemId(string category, int certificationItemId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                if (category.Equals(CertificationCategory.STC.ToLowerString()))
                {
                    return db.qdt_tq_skill_code.Single(n => n.id == certificationItemId).skill_code;
                }
                else if (category.Equals(CertificationCategory.LLC.ToLowerString()))
                {
                    return db.qdt_ll_lesson.Single(n => n.id == certificationItemId).subject;
                }
                else
                {
                    throw new Exception("找不到对应的技能代码或者学习主题");
                }
            }
        }

        [FormHandler]
        [DirectInclude]
        public ActionResult DirectCertification()
        {
            var form = Request.Form;
            int certificationItemId = Convert.ToInt32(form["certification_item_id"]);
            int employeeId = Convert.ToInt32(form["employee_id"]);
            string category = form["category"];
            bool isTrainer = form["is_trainer"] != null && form["is_trainer"] == "on";
            string remark = form["remark"];

            //判断该员工的这个技能是否已获得该技能
            if (IsValidCreateCertification(category, employeeId, certificationItemId))
            {
                string certificationItem = GetCertificationItemByCertificationItemId(category, certificationItemId);

                int? effecetiveTime = 180;
                bool directCertificateAbility = false;
                if (Request.Files.Count == 0)
                {
                    throw new Exception("No attachment uploaded.");
                }

                string fileBaesDirectory = GetFileSaveDirectoryBase(AttachmentDirectories["certification"]);

                using (QDTEntities db = new QDTEntities())
                {
                    if (category == CertificationCategory.LLC.ToString().ToLower())
                    {
                        //use lesson's effective time
                        effecetiveTime = db.qdt_ll_lesson.Single(n => n.subject == certificationItem).effective_time ?? 180;
                        directCertificateAbility = CheckDirectCertificateAbility(category, certificationItemId, employeeId);
                    }
                    else if (category == CertificationCategory.STC.ToString().ToLower())
                    {
                        //use skill code's effective time
                        effecetiveTime = db.qdt_tq_skill_code.Single(n => n.id == certificationItemId).effective_time ?? 180;
                        directCertificateAbility = CheckDirectCertificateAbility(category, certificationItemId, employeeId);
                    }

                    //验证操作者是否有权限直接授权


                    if (directCertificateAbility)
                    {
                        DateTime now = DateTime.Now;
                        var certification = new qdt_tq_certification()
                        {
                            category = category,
                            employee_id = employeeId,
                            certification_item = certificationItem,
                            certification_item_id = certificationItemId,
                            request_id = null,
                            issue_date = now,
                            refresh_date = DateTime.Now,
                            expire_date = DateTime.Now.AddDays(effecetiveTime.Value),
                            status = CertificationStatus.Active.ToString().ToLower(),
                            certify_mode = CertifyMode.Direct.ToString().ToLower(),
                            is_trainer = isTrainer,
                            remark = remark
                        };
                        db.qdt_tq_certification.AddObject(certification);
                        db.SaveChanges();
                        // insert into qdt_workflow action
                        var userId = GetSessionUserId();
                        var workflowAction = new qdt_workflow_action()
                        {
                            action_target = WorkflowActionTarget.DirectCertification.ToLowerString(),
                            target_id = certification.id,
                            process_action = WorkflowActionType.Approve.ToLowerString(),
                            handler = userId,
                            process_time = now,
                            remark = remark
                        };
                        db.qdt_workflow_action.AddObject(workflowAction);
                        db.SaveChanges();


                        string fileLocation = "/qdtTqDirectCertificationAttachments/";

                        int attachmentCount = 1;
                        foreach (string f in Request.Files)
                        {
                            HttpPostedFileBase file = Request.Files[f];
                            if (file != null && file.ContentLength > 0)
                            {

                                string path = "\\Files\\";// Server.MapPath(fileLocation); //map to the server path

                                string fileName = certificationItemId + "_" +
                                                  file.FileName.Substring(file.FileName.LastIndexOf('\\') + 1,
                                                      file.FileName.LastIndexOf('.') - file.FileName.LastIndexOf('\\') -
                                                      1) + "_" +
                                                  DateTime.Now.Year + "_" +
                                                  DateTime.Now.Month + "_" +
                                                  DateTime.Now.Day + "_" +
                                                  attachmentCount++ + "." +
                                                  file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                                try
                                {
                                    SystemAdminController.AddAttachment("directTq", certification.id.ToString(),
                                        path + fileName, GetCurrentUser().user_id);
                                    file.SaveAs(path + fileName); //保存文件
                                }
                                catch (Exception e)
                                {
                                    throw e;
                                }
                            }
                        }

                        //Send Email
                        object[] args = new object[3];
                        args[0] = certification.id;
                        HtmlMailController.SendNotification(EmailType.QdtTqDirectCertificationCreated, args);
                    }
                    else
                    {
                        return this.DirectFailure("您没有权限直接授权该技能！");
                    }

                }
            }
            else
            {
                return this.DirectFailure("该员工的这个技能正在培训或者该员工已获得该技能，不可直接授权！");
            }
            return DirectSuccess();
        }

        private bool CheckDirectCertificateAbility(string category, int certificationItemId, int employeeId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                if (
                    db.qdt_tq_certification.Any(
                        n =>
                            n.category.Equals(category) && n.certification_item_id ==
                                certificationItemId && n.employee_id == employeeId))
                {
                    return true;
                }
                return false;
            }

        }


        /// <summary>
        /// Cancel training
        /// </summary>
        /// <param name="request_id">Training workflow request id</param>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult CancelTraining(int requestId, string remark)
        {
            try
            {
                int userId = GetSessionUserId();
                Workflow.CancelRequest(requestId, remark, userId);
                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="action"></param>
        /// <param name="approvers"></param>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult UpdateApprover(int id, string action, List<int> approvers)
        {
            return null;
        }


        [DirectInclude]
        public ActionResult GetApprover(int id, int stage)
        {
            return null;
        }


        [DirectInclude]
        public ActionResult GetTrainingProcess(int id)
        {
            return null;
        }

        [DirectInclude]
        public ActionResult GetTrainingRejectionHistory(int id)
        {
            return null;
        }

        [DirectInclude]
        public ActionResult GetSkills(string item, int oper_num, string type)
        {
            return null;
        }



        [DirectInclude]
        public ActionResult GetPendingApprovalTrainings()
        {
            return null;
        }

        #region maintain training process

        #endregion


        #region employee skill

        [DirectInclude]
        public ActionResult DeactivateEmployeeSkill(string id, DeactivateReason reason)
        {
            return null;
        }

        #endregion

        [DirectInclude]
        public ActionResult GetSkillRelatedOperations(int id)
        {
            return null;
        }

        [DirectInclude]
        public ActionResult GetOperationSkills(string item, int oper_num)
        {
            return null;
        }


        /// <summary>
        /// Return skill certifications
        /// </summary>
        public void ExportCertifications()
        {

        }

        [DirectInclude]
        public ActionResult GetPersonSkillCount(JObject o)
        {
            using (QDTEntities db = new QDTEntities())
            {
                string query = o.GetString("query");
                return DirectSuccess(db.qdtTqGetPersonSkillCountSp(query).ToList());
            }
        }


        [DirectInclude]
        public ActionResult GetGroupSkillCount(int workingGroupId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                return DirectSuccess(db.qdtTqGetGroupSkillCountSp(workingGroupId).ToList());
            }
        }

        [DirectInclude]
        public ActionResult GetStcCertifications(JObject o)
        {
            int? employeeId = o.GetNullableInt("employee_id");
            int? workingGroupId = o.GetNullableInt("working_group_id");
            int? certificationItemId = o.GetNullableInt("certification_item_id");
            string query = o.GetString("query").Trim().ToLower();
            bool filterStatus = o["filter_status"].Value<bool>();
            var statusJTokenList = o["status"].First == null ? null : o["status"].ToList();
            var statusList = new List<string>();
            if (filterStatus && statusJTokenList != null)
            {
                foreach (var jToken in statusJTokenList)
                {
                    statusList.Add(jToken.Value<string>());
                }
            }
            return DirectSuccess(Certification.GetCertifications(CertificationCategory.STC.ToLowerString(), workingGroupId, employeeId, certificationItemId, filterStatus, statusList, query));
        }

        /// <summary>
        /// Get all open skill training
        /// </summary>
        /// <param name="o">Parameters hash</param>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult GetSkillTrainings(JObject o)
        {
            int? workingGroupId = o.GetNullableInt("wroking_group_id");
            string query = o.GetString("query");
            using (QDTEntities db = new QDTEntities())
            {
                var dbResult = db.qdtTqGetSkillTrainingStatusSp(workingGroupId, query).ToList().AsQueryable();
                return DirectSuccess(PagedData(o, dbResult), dbResult.Count());
            }
        }

        [DirectInclude]
        public ActionResult GetPersonSkillTrainings(JObject o)
        {
            using (QDTEntities db = new QDTEntities())
            {

                int? employeeId = o.GetNullableInt("employee_id");
                var result = new List<qdtTqGetSkillTrainingStatusSp_Result>();
                if (employeeId.HasValue)
                {
                    result = db.qdtTqGetSkillTrainingStatusSp(null, string.Empty).Where(n => n.employee_id == employeeId.Value).ToList();
                }
                return DirectSuccess(result);
            }
        }

        [DirectInclude]
        public ActionResult GetSkillCodeTrainings(JObject o)
        {
            using (QDTEntities db = new QDTEntities())
            {
                int? skillCodeId = o.GetNullableInt("skill_code_id");
                var result = new List<qdtTqGetSkillTrainingStatusSp_Result>();
                if (skillCodeId.HasValue)
                {
                    result = db.qdtTqGetSkillTrainingStatusSp(null, string.Empty).Where(n => n.certification_item_id == skillCodeId.Value).ToList();
                }
                return DirectSuccess(result);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="skill_code_id"></param>
        /// <returns>The workflow steps to complete a skill code training, and default approvers</returns>
        [DirectInclude]
        public ActionResult GetStandardSkillTrainingRoutes(int skill_code_id, bool is_direct_certification, bool is_npi_direct_certification, bool is_refresh_training)
        {
            using (QDTEntities db = new QDTEntities())
            {
                if (!is_direct_certification && !is_npi_direct_certification && !is_refresh_training)
                {
                    var routes = db.qdtTqGetSkillTrainingRoutesSp(skill_code_id).OrderBy(n => n.step).ToList();
                    //foreach (var route in routes)
                    //{
                    //    List<int> defaultApproverIds = (from a in db.qdt_workflow_approver
                    //                                    where
                    //                                        a.request_id == 0 && a.workflow_id == route.workflow_id.Value &&
                    //                                        a.step == route.step.Value
                    //                                    select a.approver_id).Distinct().ToList();

                    //    route.approvers = string.Join(",", defaultApproverIds.Select(n => n.ToString()));
                    //}
                    return DirectSuccess(routes);
                }
                else if (is_direct_certification)
                {
                    var routes = db.qdtTqGetSkillTrainingDirectCertificationRoutesSp(skill_code_id).OrderBy(n => n.step).ToList();
                    //foreach (var route in routes)
                    //{
                    //    List<int> defaultApproverIds = (from a in db.qdt_workflow_approver
                    //                                    where
                    //                                        a.request_id == 0 && a.workflow_id == route.workflow_id &&
                    //                                        a.step == route.step
                    //                                    select a.approver_id).Distinct().ToList();

                    //    route.approvers = string.Join(",", defaultApproverIds.Select(n => n.ToString()));
                    //}
                    return DirectSuccess(routes);
                }
                else if (is_npi_direct_certification)
                {
                    var routes =
                        db.qdtTqGetSkillTrainingNpiDirectCertificationRoutesSp(skill_code_id)
                            .OrderBy(n => n.step)
                            .ToList();
                    //foreach (var route in routes)
                    //{
                    //    List<int> defaultApproverIds = (from a in db.qdt_workflow_approver
                    //        where
                    //            a.request_id == 0 && a.workflow_id == route.workflow_id &&
                    //            a.step == route.step
                    //        select a.approver_id).Distinct().ToList();

                    //    route.approvers = string.Join(",", defaultApproverIds.Select(n => n.ToString()));
                    //}
                    return DirectSuccess(routes);
                }
                else if (is_refresh_training)
                {
                    var routes =
                       db.qdtTqGetSkillTrainingRefreshRoutesSp(skill_code_id)
                           .OrderBy(n => n.step)
                           .ToList();
                    return DirectSuccess(routes);
                }
                else
                {
                    return DirectSuccess("新建技能培训有误！请截图并联系IT");
                }

            }

        }

        [DirectInclude]
        public ActionResult GetSkillTrainingRoutes(int request_id)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var processes = db.qdtGetWorkflowProcessesSp(request_id).ToList();
                foreach (var route in processes)
                {
                    List<int> approverIds = (from a in db.qdt_workflow_approver
                                             where a.request_id == request_id && a.step == route.step
                                             select a.approver_id).ToList();
                    route.approvers = string.Join(",", approverIds.Select(n => n.ToString()));
                }
                return DirectSuccess(processes);
            }
        }


        [DirectInclude]
        public ActionResult GetWorkflowProcesses(int request_id)
        {
            return DirectSuccess(Workflow.GetProcesses(request_id).Select(n => new VmWorkflowProcess(n)));
        }

        [DirectInclude]
        public ActionResult GetWorkflowActions(string action_target, int target_id)
        {
            return DirectSuccess(Workflow.GetWorkflowActions(action_target, target_id));
        }

        [DirectInclude]
        public ActionResult GetProcessScanRecords(int process_id)
        {
            return DirectSuccess(ScanRecord.GetProcessScanRecords(process_id));
        }

        [DirectInclude]
        public ActionResult HasUnfinishedRecord(int process_id)
        {

            var records = ScanRecord.GetProcessScanRecords(process_id);
            foreach (var record in records)
            {
                if (record.end_time == null)
                {
                    return this.Direct(new
                    {
                        success = true,
                        hasUnfinishedRecord = true
                    });
                }
            }
            return this.Direct(new
            {
                success = true,
                hasUnfinishedRecord = false
            });

        }

        [DirectInclude]
        public ActionResult GetUserProcessApprovals()
        {
            int userId = GetCurrentUser().user_id;
            return DirectSuccess(Workflow.GetUserProcessApprovals(userId));
        }

        [DirectInclude]
        public ActionResult GetSkillCertifiedPerson(int id, bool active_only)
        {
            return null;
        }


        [DirectInclude]
        public ActionResult GetTrainerAttachments(string refNum)
        {
            return this.DirectSuccess(Attachment.GetAttachments("trainerCertification", refNum));
        }

        public void DownloadTrainerAttachment(string attachmentFullFileName)
        {
            string outFileDict = Server.MapPath("/qdtTqTrainerCertificationAttachments/");
            string fullPath = Path.Combine(outFileDict, attachmentFullFileName);
            FileHandler.DownloadFile(fullPath, attachmentFullFileName, Response, false);
        }

        [FormHandler]
        [DirectInclude]
        public ActionResult TrainerCertification()
        {

            var form = Request.Form;
            int certificationItemId = Convert.ToInt32(form["certification_item_id"]);
            int employeeId = Convert.ToInt32(form["employee_id"]);
            string category = CertificationCategory.STC.ToLowerString();
            bool isTrainer = true;
            string remark = form["remark"];

            //判断该员工的这个技能是否已获得该技能
            if (IsValidCertificateTrainer(category, employeeId, certificationItemId))
            {

                if (Request.Files.Count == 0)
                {
                    throw new Exception("No attachment uploaded.");
                }

                //  string fileBaesDirectory = GetFileSaveDirectoryBase(AttachmentDirectories["certification"]);

                using (QDTEntities db = new QDTEntities())
                {

                    //验证操作者是否有权限直接授权
                    DateTime now = DateTime.Now;
                    string stcS = CertificationCategory.STC.ToLowerString();
                    string activeS = CertificationStatus.Active.ToLowerString();
                    var certification =
                        db.qdt_tq_certification.Single(
                            n =>
                                n.category.Equals(stcS) &&
                                                  n.certification_item_id == certificationItemId &&
                                                  n.employee_id == employeeId && n.status.Equals(activeS));
                    certification.is_trainer = isTrainer;
                    db.SaveChanges();


                    // insert into qdt_workflow action
                    var userId = GetSessionUserId();
                    var workflowAction = new qdt_workflow_action()
                    {
                        action_target = WorkflowActionTarget.TrainerCertification.ToLowerString(),
                        target_id = certification.id,
                        process_action = WorkflowActionType.Approve.ToLowerString(),
                        handler = userId,
                        process_time = now,
                        remark = remark
                    };
                    db.qdt_workflow_action.AddObject(workflowAction);
                    db.SaveChanges();


                    string fileLocation = "/qdtTqTrainerCertificationAttachments/";

                    int attachmentCount = 1;
                    foreach (string f in Request.Files)
                    {
                        HttpPostedFileBase file = Request.Files[f];
                        if (file != null && file.ContentLength > 0)
                        {

                            string path = Server.MapPath(fileLocation); //map to the server path

                            string fileName = certificationItemId + "_" +
                                              file.FileName.Substring(file.FileName.LastIndexOf('\\') + 1,
                                                  file.FileName.LastIndexOf('.') - file.FileName.LastIndexOf('\\') -
                                                  1) + "_" +
                                              DateTime.Now.Year + "_" +
                                              DateTime.Now.Month + "_" +
                                              DateTime.Now.Day + "_" +
                                              attachmentCount++ + "." +
                                              file.FileName.Split('.')[file.FileName.Split('.').Length - 1];
                            try
                            {
                                SystemAdminController.AddAttachment("trainerCertification", certification.id.ToString(),
                                    path + fileName, GetCurrentUser().user_id);
                                file.SaveAs(path + fileName); //保存文件
                            }
                            catch (Exception e)
                            {
                                throw e;
                            }
                        }
                    }

                    //Send Email
                    //object[] args = new object[3];
                    //args[0] = certification.id;
                    //HtmlMailController.SendNotification(EmailType.QdtTqDirectCertificationCreated, args);

                }
            }
            else
            {
                return this.DirectFailure("该员工的并未获得获得该技能或者已经是该技能的培训师，不可直接授权！");
            }
            return DirectSuccess();

        }

        [DirectInclude]
        public ActionResult RemoveTrainerCertification(int id)
        {
            return null;
        }


        [DirectInclude]
        public ActionResult GetActiveTraining(string item, int oper_num)
        {

            return null;
        }

        [DirectInclude]
        public ActionResult UpdateSkillTrainingApprovers(int request_id, List<qdt_workflow_approver> approvers)
        {
            try
            {
                Workflow.UpdateApprovers(request_id, approvers);
                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        public ActionResult GetOperationalRestrictions(JObject o)
        {
            using (QDTEntities db = new QDTEntities())
            {
                string item = o.GetString("item");
                int operationId = o.GetNullableInt("operation_id").Value;
                string workType = o.GetString("work_type");
                int operNum = Int32.Parse(o.GetString("oper_num"));
                return DirectSuccess(db.qdtTqGetOperationalRestrictionsSp(workType, item,operNum, operationId).ToList());
            }

        }

        [DirectInclude]
        public ActionResult GetCertificationItems(JObject o)
        {
            using (QDTEntities db = new QDTEntities())
            {
                string category = o.GetString("category");
                string query = o.GetString("query").Trim().ToLower();
                var dbResult = db.qdtTqGetCertificationItemsSp().Where(n => n.certification_category == category && n.certification_item.ToLower().Contains(query)).ToList().AsQueryable();
                return DirectSuccess(PagedData(o, dbResult), dbResult.Count());
            }
        }

        [DirectInclude]
        public ActionResult AddOperationalRestrictions(string work_type, string category, int certification_item_id, List<int> operationIds)
        {
            try
            {
                using (PmbEntities pmb = new PmbEntities())
                using (QDTEntities db = new QDTEntities())
                {
                    foreach (var operationId in operationIds)
                    {
                        var operation = pmb.sl_operation.Single(n => n.id == operationId);
                        var restriction = new qdt_tq_operational_restriction()
                        {
                            certification_category = category,
                            certification_item_id = certification_item_id,
                            item = operation.item,
                            oper_num = operation.oper_num,
                            operation_id = operationId,
                            row_pointer = Guid.NewGuid(),
                            work_type = work_type
                        };
                        db.qdt_tq_operational_restriction.AddObject(restriction);
                    }
                    db.SaveChanges();
                    return DirectSuccess();
                }
            }
            catch
            {
                return DirectFailure("限制条件可能已经存在，请检查是否正确！");
            }

        }

        [DirectInclude]
        public ActionResult DeleteOperationalRestriction(List<Guid> row_pointers)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    foreach (Guid row_pointer in row_pointers)
                    {
                        var restriction = db.qdt_tq_operational_restriction.Single(n => n.row_pointer == row_pointer);
                        db.qdt_tq_operational_restriction.DeleteObject(restriction);

                    }
                    db.SaveChanges();
                    return DirectSuccess();
                }
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        #region stamper request
        [FormHandler]
        [DirectInclude]
        public ActionResult RequestStamper()
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    var form = Request.Form;
                    int requestFor = Convert.ToInt32(form["request_for"]);
                    int requestor = GetSessionUserId();
                    string strDummyId = form["request_id"];
                    var dummyId = DummyIdRepository.Items.Single(n => n.Id == Guid.Parse(strDummyId));

                    if (db.qdt_tq_certification.Any(n => n.category == "stamper" && n.employee_id == requestFor && (n.status == "active" || n.status == "pending")))
                    {
                        throw new Exception(ProgramStringKey.txtRecordAlreadyExists.ToString());
                    }
                    if (!db.qdt_tq_certification.Any(n => n.category == "stc" && (n.employee_id == requestFor) && (n.status == "active" || n.status == "pending")))
                    {

                        throw new Exception(ProgramStringKey.txtNoAvailableTraining.ToString());

                    }
                    if (!(db.sys_attachment_ref.Any(n => n.ref_num == strDummyId)))
                    {

                        throw new Exception(ProgramStringKey.txtNoAttachment.ToString());


                    }



                    Workflow workflow = new Workflow("stamper", string.Empty);
                    var request = workflow.CreateRequest(requestor, requestFor,null);
                    if (!Object.Equals(request, null))
                    {
                        Certification.InitialCertification(null, null, CertifyMode.Normal, requestFor, request.id, CertificationCategory.STAMPER);
                        string fileBaesDirectory = GetFileSaveDirectoryBase(AttachmentDirectories["process"]),
                       sourceDir = Path.Combine(fileBaesDirectory, strDummyId),
                       destDir = Attachment.ReplaceDummyPath(sourceDir, dummyId.Id, request.id.ToString());

                        if (Directory.Exists(sourceDir))
                        {
                            Directory.Move(sourceDir, destDir);
                            foreach (var reference in db.sys_attachment_ref.Where(n => n.ref_num == strDummyId))
                            {
                                var processId = Workflow.GetProcesses(request.id).Single(n => n.step == 0).id;
                                reference.ref_num = processId.ToString();
                                foreach (var attachment in db.sys_attachment.Where(n => n.attachment_id == reference.attachment_id))
                                {
                                    attachment.file_path = Attachment.ReplaceDummyPath(attachment.file_path, dummyId.Id,
                                        request.id.ToString());
                                }
                                reference.ref_type = "request";
                                db.AddTosys_attachment_ref(new sys_attachment_ref
                                {
                                    ref_type = "process",
                                    ref_num = request.id.ToString(),
                                    attachment_id = reference.attachment_id

                                });

                            }
                            db.SaveChanges();
                        }
                        DummyIdRepository.Remove(dummyId.Id);
                        return DirectSuccess(request.id);

                    }
                    else
                    {
                        throw new Exception(ProgramStringKey.txtCreateTrainingFailed.ToString());
                    }

                }
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }


        [DirectInclude]
        public ActionResult GetStamperList(JObject o)
        {

            QDTEntities db = new QDTEntities();

            var searchConditions = o["search_conditions"];


            if (searchConditions == null)
            {


                //var result = db.qdt_tq_certification.Where(n => n.category == "stamper").ToList();

                var result = (from a in db.qdt_tq_certification
                              join b in db.qdt_workflow_request on a.request_id equals b.id
                              where a.category == "stamper"
                              select new { a, b.requestor }).ToList();

                return DirectSuccess(result, result.Count);
            }

            else
            {
                string status = searchConditions["status"].Value<string>();
                int createBy = searchConditions["create_by"].Value<string>() != "" ? searchConditions["create_by"].Value<int>() : 0;

                var stamperListSearch =
                    db.qdt_tq_certification.Where(
                        n => (n.request_id == createBy || createBy == 0) && (n.status == status || status == "") && n.category == "stamper").ToList();


                return DirectSuccess(stamperListSearch, stamperListSearch.Count);
            }


        }
        [DirectInclude]
        public ActionResult GetRefNum(int requestId)
        {
            QDTEntities ent = new QDTEntities();

            ObjectResult<int?> refNum = ent.qdtStamperGetRefNum(requestId);

            return DirectSuccess(refNum);

        }


        [DirectInclude]
        public ActionResult DeleteStamper(int employeeId)
        {
            try
            {
                QDTEntities ent = new QDTEntities();
                ObjectResult<string> result = ent.qdtStamperDelete(employeeId, "stamper");
                foreach (var each in result)
                {
                    if (System.IO.File.Exists(@each))
                    {
                        System.IO.File.Delete(@each);
                    }
                }
                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure(e.Message);

            }

        }

        #endregion

        #region process scan

        [DirectInclude]
        public ActionResult StartProcessScan(int employee_id, int process_id, string job, int oper_num)
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    var userId = VmNativeUser.GetUserIdByEmployeeId(employee_id);
                    var transactionTime = db.pmb_scan_check_in.Single(n => n.employee_id == employee_id).transaction_time.Value;
                    var paramShiftId = new ObjectParameter("shift_id", typeof(int));
                    db.pmbGetMatchedShiftSp(employee_id, paramShiftId);
                    var shiftId = Convert.ToInt32(paramShiftId.Value);
                    var shift = shiftId != 0 ? db.pmb_shift_schedule.Single(n => n.id == shiftId):null;
                    var transaction = new pmb_scan_transaction()
                    {
                        employee_id = employee_id,
                        job = job,
                        oper_num = oper_num,
                        shift_code = shift != null ? shift.shift_code: null,
                        start_time = transactionTime,
                        suffix = 0,
                        trans_type = TransactionType.Process.ToLowerString(),
                        update_by = userId,
                        update_date = transactionTime,
                        work_date = shift != null ? shift.work_date:System.DateTime.Today
                    };
                    db.pmb_scan_transaction.AddObject(transaction);
                    db.SaveChanges();
                    var processScan = new qdt_process_scan()
                    {
                        process_id = process_id,
                        transaction_id = transaction.id
                    };
                    db.qdt_process_scan.AddObject(processScan);
                    db.SaveChanges();
                }

                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        public ActionResult EndProcessScan(int id)
        {

            using (PmbEntities db = new PmbEntities())
            {

                var transaction = db.pmb_scan_transaction.Single(n => n.id == id);
                //  var transactionTime =db.pmb_scan_check_in.Single(n => n.employee_id == transaction.employee_id).transaction_time;
                var transactionTime = System.DateTime.Now;

                transaction.end_time = transactionTime;

                transaction.update_date = transactionTime;

                transaction.update_by = VmNativeUser.GetUserIdByEmployeeId(transaction.employee_id.Value);

                transaction.work_time =
                    Convert.ToDecimal((transactionTime - transaction.start_time.Value).TotalMinutes);

                db.SaveChanges();
                return DirectSuccess();
            }


        }

        [DirectInclude]
        public ActionResult JobRestrictCheck(string item, int opNum, string certificationCategory, string skillCode)
        {
            using (QDTEntities ent = new QDTEntities())
            {

                var itemId = ent.qdt_tq_skill_code.Single(n => n.skill_code == skillCode).id;

                var result = ent.qdt_tq_operational_restriction.Where(
                     n =>
                         n.item == item && n.oper_num == opNum && n.certification_category == certificationCategory &&
                         n.certification_item_id == itemId);

                if (result.Any())
                {

                    return DirectSuccess(1);


                }
                else
                {
                    return DirectSuccess(0);
                }
            }
         }
        #endregion
    }
}
