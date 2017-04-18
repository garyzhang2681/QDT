using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages.Scope;
using Ext.Direct.Mvc;
using NPOI.SS.Formula.Functions;
using ProductionManagement.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using Newtonsoft.Json.Linq;
using Common.Utility.Extension;
using System.Data.Objects;
using SZIntraV3_1_WebSite.Models.Tq;
using SZIntraV3_1_WebSite.Models.System;
using SZIntraV3_1_WebSite.Utility;
using NPOI.SS.UserModel;
using NPOI.HSSF.UserModel;
using Common.Utility.Excel;
using SZIntraV3_1_WebSite.Models;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpSkillController : QdtBaseController
    {

        #region export
        public void ExportSkillCodes()
        {
            using (QDTEntities db = new QDTEntities())
            {
                var skills = db.qdt_tq_skill_code.ToList();
                IWorkbook workbook = new HSSFWorkbook();
                ISheet sheet = workbook.CreateSheet("Skill Codes");
                IRow headerRow = sheet.CreateRow(0);
                headerRow.CreateCell(0).SetCellValue("#");
                headerRow.CreateCell(1).SetCellValue("Skill Code");
                headerRow.CreateCell(2).SetCellValue("Description");
                headerRow.CreateCell(3).SetCellValue("Category");
                headerRow.CreateCell(4).SetCellValue("Critical");
                headerRow.CreateCell(5).SetCellValue("Work Type");
                headerRow.CreateCell(6).SetCellValue("Business");
                headerRow.CreateCell(7).SetCellValue("Effective Days");
                headerRow.CreateCell(8).SetCellValue("Fixed Retrain Days");
                foreach (var skill in skills)
                {
                    var row = sheet.CreateRow(skills.IndexOf(skill) + 1);
                    row.CreateCell(0, CellType.NUMERIC).SetCellValue(skill.id);
                    row.CreateCell(1, CellType.STRING).SetCellValue(skill.skill_code);
                    row.CreateCell(2, CellType.STRING).SetCellValue(skill.description);
                    row.CreateCell(3, CellType.STRING).SetCellValue(skill.category);
                    if (skill.critical.HasValue)
                    {
                        row.CreateCell(4, CellType.BOOLEAN).SetCellValue(skill.critical.Value);
                    }
                    else
                    {
                        row.CreateCell(4, CellType.BOOLEAN).SetCellValue(false);
                    }
                    row.CreateCell(5, CellType.STRING).SetCellValue(skill.work_type.ToUpper());
                    row.CreateCell(6, CellType.STRING).SetCellValue(skill.business.Capitalization());
                    if (skill.effective_time.HasValue)
                    {
                        row.CreateCell(7, CellType.NUMERIC).SetCellValue(skill.effective_time.Value);
                    }
                    else
                    {
                        row.CreateCell(7, CellType.BLANK);
                    }
                    if (skill.fixed_effective_time.HasValue)
                    {
                        row.CreateCell(8, CellType.NUMERIC).SetCellValue(skill.fixed_effective_time.Value);
                    }
                    else
                    {
                        row.CreateCell(8, CellType.BLANK);
                    }
                }
                NPOIHelper.ExportWorkbook(Response, workbook, "SkillCodes");
            }
        }

        #endregion export

        #region skill code
        [DirectInclude]
        public ActionResult GetSkillCodeCategories(string query)
        {
            query = query.Trim().ToLower();
            using (QDTEntities db = new QDTEntities())
            {
                var data = db.qdt_tq_skill_code.Select(n => new
                {
                    category = n.category
                }).Where(n => n.category.ToLower().Contains(query)).Distinct().ToList();
                return DirectSuccess(data);
            }
        }

        [DirectInclude]
        public ActionResult GetSkillCodeDescriptions(string query)
        {
            query = query.Trim().ToLower();
            using (QDTEntities db = new QDTEntities())
            {
                var data = db.qdt_tq_skill_code.Select(n => new
                {
                    description = n.description
                }).Where(n => n.description.ToLower().Contains(query)).Distinct().ToList();
                return DirectSuccess(data);
            }
        }

        [DirectInclude]
        [FormHandler]
        public ActionResult SaveSkillCode()
        {
            var form = Request.Form;
            string skillCode = form["skill_code"],
                description = form["description"],
                category = form["category"],
                business = form["business"],
                workType = form["work_type"],
                saveMode = form["save_mode"],
                workflowType = form["workflow_type"];

            int learningTime = Convert.ToInt32(form["learning_time"]);
            int? effectiveTime = form["effective_time"].Equals("") ? (int?)null : Convert.ToInt32(form["effective_time"]);
            int invalidTime = Convert.ToInt32(form["invalid_time"]);
            bool isSpecialSkill = form["is_special_skill"] != null && form["is_special_skill"].ToString() == "on";
            bool critical = form["critical"] != null && form["critical"].ToString() == "on";
            int id = 0;
            using (QDTEntities db = new QDTEntities())
            {
                var skill = new qdt_tq_skill_code();
                switch (workType)
                {
                    case "qa": business = "Quality"; break;
                    case "whs": business = "Warehouse"; break;
                    default: break;
                }
                if (saveMode == "edit")
                {
                    id = Convert.ToInt32(form["id"]);
                    skill = db.qdt_tq_skill_code.Single(n => n.id == id);
                }
                else
                {
                    db.qdt_tq_skill_code.AddObject(skill);
                    skill.skill_code = skillCode;
                }
                skill.description = description;
                skill.category = category;
                skill.business = business;
                skill.work_type = workType;
                skill.critical = critical;
                skill.learning_time = learningTime;
                skill.invalid_time = invalidTime;
                skill.workflow_type = workflowType;
                skill.is_special_skill = isSpecialSkill;
                skill.is_deleted = false;
                if (isSpecialSkill)
                {
                    skill.effective_time = null;
                }
                else
                {

                    skill.effective_time = effectiveTime;
                }
                db.SaveChanges();
            }
            return DirectSuccess();

        }


        [DirectInclude]
        public ActionResult DeleteSkillCode(int id)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    var paramInUse = new ObjectParameter("result", typeof(bool));
                    db.qdtTqCheckSkillCodeInUseSp(id, paramInUse);
                    if ((bool)paramInUse.Value)
                    {
                        throw new Exception("txtSkillCodeIsInUse");
                    }
                    else
                    {
                        var skill = db.qdt_tq_skill_code.Single(n => n.id == id);
                        db.qdt_tq_skill_code.DeleteObject(skill);
                        db.SaveChanges();
                        return DirectSuccess();
                    }
                }
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }



        [DirectInclude]
        public ActionResult GetInUseSkillCodes(JObject o)
        {
            string query = o.GetString("query").Trim().ToLower(),
                    business = o.GetString("business");
            using (QDTEntities db = new QDTEntities())
            {

                if (business.Equals("all"))
                {
                    var dbResult = db.qdt_tq_skill_code.Where(n => n.skill_code.ToLower().Contains(query) && (n.is_deleted != true || n.is_deleted == null)).AsQueryable();
                    return DirectSuccess(PagedData(o, dbResult).ToList(), dbResult.Count());
                }
                else
                {
                    var dbResult = db.qdt_tq_skill_code.Where(n => (business.Length == 0 || n.business.ToLower() == business.ToLower()) && n.skill_code.ToLower().Contains(query) && (n.is_deleted != true || n.is_deleted == null)).AsQueryable();
                    return DirectSuccess(PagedData(o, dbResult).ToList(), dbResult.Count());
                }


            }
        }


        [DirectInclude]
        public ActionResult GetSkillCodes(JObject o)
        {
            string query = o.GetString("query").Trim().ToLower(),
                    business = o.GetString("business");
            using (QDTEntities db = new QDTEntities())
            {

                if (business.Equals("all"))
                {
                    var dbResult = db.qdt_tq_skill_code.Where(n => n.skill_code.ToLower().Contains(query)).AsQueryable();
                    return DirectSuccess(PagedData(o, dbResult).ToList(), dbResult.Count());
                }
                else
                {
                    var dbResult = db.qdt_tq_skill_code.Where(n => (business.Length == 0 || n.business.ToLower() == business.ToLower()) && n.skill_code.ToLower().Contains(query)).AsQueryable();
                    return DirectSuccess(PagedData(o, dbResult).ToList(), dbResult.Count());
                }


            }
        }

        #endregion skill code

        #region skill operations


        [DirectInclude]
        public ActionResult GetSkillRelatedOperations(int skill_code_id)
        {
            //only 'run'
            using (QDTEntities qdt = new QDTEntities())
            using (PmbEntities db = new PmbEntities())
            {

                var operationIds = (from r in qdt.qdt_tq_operational_restriction
                                    where r.certification_item_id == skill_code_id
                                        && r.work_type == "run"
                                    select r.operation_id).ToList();
                var result = (from operation in db.sl_operation
                              where operationIds.Contains(operation.id)
                              select operation).ToList();
                return DirectSuccess(result);
            }
        }

        [DirectInclude]
        public ActionResult AddRelatedOperations(int skill_code_id, List<int> operationIds)
        {
            try
            {
                using (PmbEntities pmb = new PmbEntities())
                using (QDTEntities db = new QDTEntities())
                {
                    foreach (var id in operationIds)
                    {
                        var operation = pmb.sl_operation.Single(n => n.id == id);
                        var operationSkill = new qdt_tq_operational_restriction()
                        {
                            certification_item_id = skill_code_id,
                            certification_category = CertificationCategory.STC.ToLowerString(),
                            item = operation.item,
                            oper_num = operation.oper_num,
                            operation_id = id,
                            work_type = "run",
                            row_pointer = Guid.NewGuid()
                        };
                        db.qdt_tq_operational_restriction.AddObject(operationSkill);
                    }
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
        public ActionResult RemoveRelatedOperations(int skill_code_id, List<int> operationIds)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    foreach (var id in operationIds)
                    {
                        var record = db.qdt_tq_operational_restriction.Single(n => n.certification_item_id == skill_code_id && n.operation_id == id && n.work_type == "run");
                        db.qdt_tq_operational_restriction.DeleteObject(record);
                    }
                    db.SaveChanges();
                }
                return DirectSuccess();
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        #endregion skill operations

        private qdt_tq_skill_code GetSkillCode(int id)
        {
            using (QDTEntities db = new QDTEntities())
            {
                return db.qdt_tq_skill_code.Single(n => n.id == id);
            }
        }

        #region skill training


        [DirectInclude]
        public ActionResult CheckRefreshCertification(string category, int employeeId, int skillCodeId)
        {
            if (CanRefreshCertification(category, employeeId, skillCodeId))
            {
                return this.DirectSuccess(true);
            }
            else
            {
                return this.DirectSuccess(false);
            }
        }


        /// <summary>
        /// Create new skill training application
        /// </summary>
        /// <param name="employee_id"></param>
        /// <param name="id"></param>
        /// <param name="skill"></param>
        /// <param name="is_refresh"></param>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult CreateTraining(int employeeId, int skillCodeId, CertifyMode certifyMode, List<qdt_workflow_approver> approvers)
        {
            var userId = GetSessionUserId();


            if (certifyMode.Equals(CertifyMode.Refresh.ToLowerString()) && !CanRefreshCertification(CertificationCategory.STC.ToLowerString(), employeeId, skillCodeId))
            {
                return this.DirectFailure("该员工不能刷新该技能！");
            }
            else
            {

                //check这个员工是否已经有这个技能，或者正在培训，也就是certification状态为active 或者pending
                using (QDTEntities db = new QDTEntities())
                {
                    string activeS = CertificationStatus.Active.ToLowerString();
                    string inactiveS = CertificationStatus.Inactive.ToLowerString();
                    string pendingS = CertificationStatus.Pending.ToLowerString();
                    string stcS = CertificationCategory.STC.ToLowerString();
                    var result =
                        db.qdt_tq_certification.Where(
                            n =>
                                n.category.Equals(stcS) && n.employee_id == employeeId &&
                                n.certification_item_id == skillCodeId &&
                                (n.status.Equals(activeS) || n.status.Equals(pendingS))).ToList();
                    if (result.Count() > 0)
                    {
                        return this.DirectFailure("不可为该员工创建这个技能的Training（已获得这个技能，或者该技能正在培训中）");
                    }


                    var skill = GetSkillCode(skillCodeId);
                    Workflow workflow = null;
                    if (certifyMode.Equals(CertifyMode.Direct))
                    {
                        workflow = new Workflow(CertificationCategory.STC.ToLowerString(), WorkflowType.Directcert.ToLowerString());
                    }
                    else if (certifyMode.Equals(CertifyMode.Refresh))
                    {
                        //check 时候满足refresh条件
                        if (skill.effective_time == null)
                        {
                            return this.DirectFailure("该技能不能通过刷新技能重新获得");
                        }
                        else
                        {

                            var certifications = (from qtc in db.qdt_tq_certification
                                                  where
                                                      qtc.category.Equals(stcS) &&
                                                      qtc.status.Equals(inactiveS) &&
                                                      qtc.employee_id == employeeId &&
                                                      qtc.certification_item_id == skillCodeId
                                                  select qtc).ToList();


                            certifications = certifications.Where(n => (n.refresh_date == null &&
                                                                        (n.issue_date.Value.AddDays(
                                                                            skill.invalid_time.Value) >
                                                                         System.DateTime.Now)) ||
                                                                       (n.refresh_date.Value.AddDays(
                                                                           skill.invalid_time.Value) >
                                                                        System.DateTime.Now)).ToList();




                            if (!certifications.Any())
                            {
                                return this.DirectFailure("该员工不满足该技能的刷新要求，请确认；如有疑问，请联系IT！");
                            }
                            else
                            {
                                if (skill.workflow_type.Equals(WorkflowType.Machining.ToLowerString()))
                                {
                                    workflow = new Workflow(CertificationCategory.STC.ToLowerString(),
                                        WorkflowType.Refreshmac.ToLowerString());
                                }
                                else if (skill.workflow_type.Equals(WorkflowType.Actuation.ToLowerString()))
                                {
                                    workflow = new Workflow(CertificationCategory.STC.ToLowerString(),
                                        WorkflowType.Refreshact.ToLowerString());
                                }
                                else if (skill.workflow_type.Equals(WorkflowType.Composite.ToLowerString()))
                                {
                                    workflow = new Workflow(CertificationCategory.STC.ToLowerString(),
                                        WorkflowType.Refreshcom.ToLowerString());
                                }
                            }
                        }
                    }
                    else if (certifyMode.Equals(CertifyMode.Npi))
                    {
                        workflow = new Workflow(CertificationCategory.STC.ToLowerString(), WorkflowType.Npi.ToLowerString());
                    }
                    else
                    {
                        workflow = new Workflow(CertificationCategory.STC.ToLowerString(), skill.workflow_type);
                    }

                    var request = workflow.CreateRequest(userId, employeeId,skillCodeId);

                    if (!Object.Equals(request, null))
                    {
                        int? certificationId = Certification.InitialCertification(skillCodeId, skill.skill_code,
                            certifyMode, employeeId, request.id, CertificationCategory.STC);
                        Workflow.UpdateApprovers(request.id, approvers);


                        object[] args = new object[2];
                        args[0] = certificationId;
                        args[1] = db.qdt_workflow_process.Single(n => n.request_id == request.id && n.step == 0).id;
                        HtmlMailController.SendNotification(EmailType.QdtStcSkillCreated, args);
                        return DirectSuccess();
                    }

                    else
                    {
                        throw new Exception(ProgramStringKey.txtCreateTrainingFailed.ToString());
                    }
                }
            }

        }



        [DirectInclude]
        public ActionResult GetSkillTrainers(int skillCodeId, int step, CertifyMode certifyMode)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var activeS = CertificationStatus.Active.ToLowerString();
                var stcS = CertificationCategory.STC.ToLowerString();

                var nativeUsers = VmNativeUser.GetAll();

                // Add default approvers
                var skillCode = db.qdt_tq_skill_code.Single(n => n.id == skillCodeId);

                //certifyMode = normal
                string workflowType = "";
                var workflow = db.qdt_workflow.Single(n => n.business.Equals(skillCode.workflow_type));
                if (certifyMode.Equals(CertifyMode.Direct))
                {
                    workflowType = WorkflowType.Directcert.ToLowerString();
                    workflow = db.qdt_workflow.Single(n => n.business.Equals(workflowType));
                }
                else if (certifyMode.Equals(CertifyMode.Npi))
                {
                    workflowType = WorkflowType.Npi.ToLowerString();
                    workflow = db.qdt_workflow.Single(n => n.business.Equals(workflowType));
                }
                else if (certifyMode.Equals(CertifyMode.Refresh))
                {
                    if (skillCode.workflow_type.Equals(WorkflowType.Machining.ToLowerString()))
                    {
                        workflowType = WorkflowType.Refreshmac.ToLowerString();
                        workflow = db.qdt_workflow.Single(n => n.business.Equals(workflowType));
                    }
                    else if (skillCode.workflow_type.Equals(WorkflowType.Actuation.ToLowerString()))
                    {
                        workflowType = WorkflowType.Refreshact.ToLowerString();
                        workflow = db.qdt_workflow.Single(n => n.business.Equals(workflowType));
                    }
                    else if (skillCode.workflow_type.Equals(WorkflowType.Composite.ToLowerString()))
                    {
                        workflowType = WorkflowType.Refreshcom.ToLowerString();
                        workflow = db.qdt_workflow.Single(n => n.business.Equals(workflowType));
                    }
                }


                //request_id表示某个流程的标准默认批准人
                var approverIds = db.qdt_workflow_approver.Where(n => n.request_id == 0 && n.workflow_id == workflow.id && n.step == step).Select(n => n.approver_id).ToList();
                var approverResult = (from a in approverIds
                                      join u in nativeUsers on a equals u.user_id
                                      select u).ToList();
                var result = approverResult.Distinct();

                var route = db.qdt_workflow_route.Single(n => n.workflow_id == workflow.id && n.step == step);

                if (workflow.category == stcS &&
                    (workflow.business.Equals(WorkflowType.Machining.ToLowerString())
                                            || workflow.business.Equals(WorkflowType.Refreshmac.ToLowerString())
                                            || workflow.business.Equals(WorkflowType.Actuation.ToLowerString())
                                            || workflow.business.Equals(WorkflowType.Refreshact.ToLowerString())
                                            || workflow.business.Equals(WorkflowType.Composite.ToLowerString())
                                            || workflow.business.Equals(WorkflowType.Refreshcom.ToLowerString())
                                            || workflow.business.Equals(WorkflowType.Warehouse.ToLowerString())) &&
                    (route.name.Contains("基础理论")
                     || route.name.Contains("实操培训"))
                    )
                {
                    var trainerIds = db.qdt_tq_certification.Where(n => n.category == stcS && n.certification_item_id == skillCodeId && n.status == activeS && n.is_trainer == true).Select(n => n.employee_id).ToList();
                    var trainerResult = (from t in trainerIds
                                         join u in nativeUsers on t.Value equals u.employee_id
                                         select u).ToList();
                    result = trainerResult.Union(approverResult).Distinct();
                }


                if (workflow.category == stcS && 
                    (((workflow.business.Equals(WorkflowType.Quality.ToLowerString())) &&
                    (route.name.Contains("基础理论")
                     || route.name.Contains("实操培训")))
                     ||
                     ((workflow.business.Equals(WorkflowType.Directcert.ToLowerString())) &&
                    route.name.Contains("培训授权")
                     ))
                    
                    )
                {
                    var skilledEmployeeIds = db.qdt_tq_certification.Where(n => n.category == stcS && n.certification_item_id == skillCodeId && n.status == activeS).Select(n => n.employee_id).ToList();
                    var trainerResult = (from t in skilledEmployeeIds
                                         join u in nativeUsers on t.Value equals u.employee_id
                                         select u).ToList();
                    result = trainerResult.Union(approverResult).Distinct();
                }



                return DirectSuccess(result);
            }
        }

        public bool CanRefreshCertification(string category, int employeeId, int skillCodeId)
        {
            try
            {
                using (QDTEntities db = new QDTEntities())
                {
                    ObjectParameter output = new ObjectParameter("can_refresh", typeof(Boolean));
                    db.qdtTqCanRefreshSP(CertificationCategory.STC.ToLowerString(), employeeId, skillCodeId, output);
                    return (bool)output.Value;
                }
            }
            catch
            {
                return false;
            }

        }


        #endregion skill training
    }
}
