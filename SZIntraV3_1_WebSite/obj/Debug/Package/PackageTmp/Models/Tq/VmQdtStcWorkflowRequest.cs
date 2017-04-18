using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Common.Utility.Extension;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    //尽量多的包含一个skill training certification的workflow中包含的所有信息
    public class VmQdtStcWorkflowRequest
    {
        public qdt_tq_certification certification { get; set; }
        public qdt_workflow_request workflowRequest { get; set; }

        //如果用户完成了步骤3，但是3还没有被批准，那么当approver批准或回退的时候，currentProcess就是3
        public qdt_workflow_process currentProcess { get; set; }


        //表示下一个步骤，如果当前步骤是3，那么nextPvarrocess可能是2（回退），也可能是4（批准）
        public qdt_workflow_process nextProcess { get; set; }

        public qdt_workflow_action currentAction { get; set; }
        public Dictionary<int, List<sys_user>> approvers { get; set; }
        public qdt_tq_skill_code skillCode { get; set; }
        public List<qdt_ll_lesson> lessons { get; set; }
        //  public Dictionary<int, List<qdt_workflow_action>> actions { get; set; }
        //  public Dictionary<int, List<qdt_workflow_process>> processes { get; set; }


        //在创建cancel一个certification，或者grant一个certification的时候是没有nextProcess的
        //currentProcessId 表示这个request刚创建
        //currentProcessId,如果是正数表示process的id，action的target是process
        //currentProcessId，如果是-1，表示action的target是request
        public VmQdtStcWorkflowRequest(string actionTarget, int certificationId, int currentProcessId = -1, int nextProcessId = -1)
        {
            qdt_workflow_process currentProcess = new qdt_workflow_process();
            qdt_workflow_action currentAction = new qdt_workflow_action();
            qdt_tq_certification certification = new qdt_tq_certification();
            qdt_workflow_request workflowRequest = new qdt_workflow_request();
            qdt_tq_skill_code skillCode = new qdt_tq_skill_code();
            qdt_workflow_process nextProcess = new qdt_workflow_process();
            List<qdt_ll_lesson> lessons = new List<qdt_ll_lesson>();
            List<int> lessonIds = new List<int>();
            Dictionary<int, List<sys_user>> processApproverList = new Dictionary<int, List<sys_user>>();
            using (QDTEntities db = new QDTEntities())
            {
                certification = db.qdt_tq_certification.Single(n => n.id == certificationId);
                workflowRequest = db.qdt_workflow_request.Single(n => n.id == certification.request_id);
                if (currentProcessId != -1)
                {
                    currentProcess = db.qdt_workflow_process.Single(n => n.id == currentProcessId);
                }
                if (nextProcessId != -1)
                {
                    try
                    {
                        nextProcess = db.qdt_workflow_process.Single(n => n.id == nextProcessId);
                    }
                    catch
                    {

                    }
                }


                string processS = WorkflowActionTarget.Process.ToLowerString();
                string requestS = WorkflowActionTarget.Request.ToLowerString();

                if (actionTarget.Equals(requestS))
                {
                    if (db.qdt_workflow_action.Any(n =>
                        n.action_target.Equals(requestS) &&
                        n.target_id == certification.request_id))
                    {
                        int currentActionId =
                            db.qdt_workflow_action.Where(
                                n =>
                                    n.action_target.Equals(requestS) &&
                                    n.target_id == certification.request_id).Max(n => n.id);

                        currentAction = db.qdt_workflow_action.Single(n => n.id == currentActionId);
                    }
                }
                else if (actionTarget.Equals(processS))
                {
                    if (db.qdt_workflow_action.Any(n =>
                       n.action_target.Equals(processS) &&
                       n.target_id == currentProcessId))
                    {
                        int currentActionId =
                            db.qdt_workflow_action.Where(
                                n =>
                                    n.action_target.Equals(processS) &&
                                    n.target_id == currentProcessId).Max(n => n.id);

                        currentAction = db.qdt_workflow_action.Single(n => n.id == currentActionId);
                    }
                }




                skillCode = db.qdt_tq_skill_code.Single(n => n.id == certification.certification_item_id);
                lessonIds = db.qdt_tq_skill_basic_lesson.Where(n => n.skill_code_id == certification.certification_item_id).Select(n => n.lesson_id).ToList();
                foreach (int lessonId in lessonIds)
                {
                    lessons.Add(db.qdt_ll_lesson.Single(n => n.id == lessonId));
                }


                //aprovers
                Dictionary<int, List<int>> processApproverIdList = db.qdt_workflow_approver.Where(n => n.request_id == certification.request_id).GroupBy(n => n.step).ToDictionary(g => g.Key, g => g.Select(n => n.approver_id).ToList());

                foreach (var processApproveId in processApproverIdList)
                {
                    processApproverList.Add(processApproveId.Key, db.sys_user.Where(n => processApproveId.Value.Contains(n.user_id)).ToList());
                }



            }

            this.certification = certification;
            this.workflowRequest = workflowRequest;
            this.currentProcess = currentProcess;
            this.nextProcess = nextProcess;
            this.currentAction = currentAction;
            this.approvers = processApproverList;
            this.skillCode = skillCode;
            this.lessons = lessons;
        }

        public static string GetApproverNames(int step, Dictionary<int, List<sys_user>> approvers)
        {
            List<sys_user> stepApprovers = approvers[step];
            string stepApproversS = stepApprovers[0].name_cn;
            for (int i = 1; i < stepApprovers.Count(); i++)
            {
                stepApproversS += ", " + stepApprovers[i].name_cn; //TODO: Language
            }
            return stepApproversS;
        }
    }
}
