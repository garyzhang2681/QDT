using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Web;
using Common.Utility.Extension;
using SuzhouHr.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using SZIntraV3_1_WebSite.Models.System;
using SZIntraV3_1_WebSite.Models.Tq;

namespace SZIntraV3_1_WebSite.Models.Ll
{
    public class VmQdtLlWorkflowRequest
    {
        public qdt_tq_certification certification { get; set; }
        public qdt_ll_lesson llLesson { get; set; }
        public qdt_workflow_request workflowRequest { get; set; }
        public qdt_workflow_action currentAction { get; set; }
        public string workflowCurrentApprover { get; set; }
        public string workflowNextApprover { get; set; }
        public Dictionary<int, List<sys_user>> approvers { get; set; }

        //如果用户完成了步骤3，但是3还没有被批准，那么当approver批准或回退的时候，currentProcess就是3
        public qdt_workflow_process currentProcess { get; set; }

        //表示下一个步骤，如果当前步骤是3，那么nextProcess可能是2（回退），也可能是4（批准）
        public qdt_workflow_process nextProcess { get; set; }
        public List<Attachment> attachments { get; set; }

        //在创建cancel一个certification，或者grant一个certification的时候是没有nextProcess的
        public VmQdtLlWorkflowRequest(string actionTarget, int certificationId, int currentProcessId=-1, int nextProcessId = -1)
        {
            using (QDTEntities db = new QDTEntities())
            {
                this.certification = db.qdt_tq_certification.Single(n => n.id == certificationId);
                string activeS = LessonStatus.Active.ToLowerString();
                this.llLesson = db.qdt_ll_lesson.Single(n => n.id == certification.certification_item_id && n.status.Equals(activeS));
                this.workflowRequest = db.qdt_workflow_request.Single(n => n.id == certification.request_id);

                Dictionary<int, List<int>> processApproverIdList = db.qdt_workflow_approver.Where(n => n.request_id == certification.request_id).GroupBy(n => n.step).ToDictionary(g => g.Key, g => g.Select(n => n.approver_id).ToList());

                Dictionary<int, List<sys_user>> approverList = new Dictionary<int, List<sys_user>>();
                foreach (var processApproveId in processApproverIdList)
                {
                    approverList.Add(processApproveId.Key, db.sys_user.Where(n => processApproveId.Value.Contains(n.user_id)).ToList());
                }
                this.approvers = approverList;





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







                if (currentProcessId != -1)
                {
                    this.currentProcess = db.qdt_workflow_process.Single(n => n.id == currentProcessId);
                }
                if (nextProcessId != -1)
                {
                    this.nextProcess = db.qdt_workflow_process.Single(n => n.id == nextProcessId);
                }
                attachments = SZIntraV3_1_WebSite.Models.Attachment.GetAttachments(AttachmentRefType.LESSON.ToLowerString(), llLesson.id.ToString());
            }

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