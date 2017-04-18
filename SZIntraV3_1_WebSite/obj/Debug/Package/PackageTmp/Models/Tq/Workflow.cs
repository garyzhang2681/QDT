using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using Common.Utility.Extension;
using SZIntraV3_1_WebSite.Utility;
using SZIntraV3_1_WebSite.Controllers;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public class Workflow
    {
        public int Id { get; set; }
        public int? LeadTime { get; set; }
        public string Business { get; set; }  //workflow_type
        public string Category { get; set; }
        public string Status { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="category"></param>
        /// <param name="business">Pass empty string if business is not restricted</param>
        public Workflow(string category, string business)// business = workflow_type
        {
            using (QDTEntities db = new QDTEntities())
            {
                if (db.qdt_workflow.Any(n => n.category == category && (business.Length == 0 || n.business == business)))
                {
                    var workflow = db.qdt_workflow.Single(n => n.category == category && (business.Length == 0 || n.business == business));
                    Id = workflow.id;
                    Category = category;
                    Business = business;
                    LeadTime = workflow.lead_time;
                    Status = workflow.status;
                }
            }
        }

        public qdt_workflow_request CreateRequest(int requestor, int requestFor,int? skillCodeId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                DateTime now = DateTime.Now;
                if (skillCodeId != null)
                {
                    int? learning_time = db.qdt_tq_skill_code.Single(n => n.id == skillCodeId).learning_time;
                    if (learning_time != null)
                    {
                        LeadTime = learning_time;
                    }
                }
                int requestId;
                var request = new qdt_workflow_request()
                {
                    current_step = 0,
                    due_date = LeadTime.HasValue ? ((DateTime?)DateTime.Now.AddDays(LeadTime.Value)) : null,
                    request_for = requestFor,
                    requestor = requestor,
                    start_time = now,
                    status = WorkflowProcessStatus.Open.ToLowerString(),
                    workflow_id = Id
                };
                db.qdt_workflow_request.AddObject(request);
                db.SaveChanges();
                requestId = request.id;


                var workflowAction = new qdt_workflow_action()
                {
                    action_target = WorkflowActionTarget.Request.ToLowerString(),
                    target_id = requestId,
                    process_action = WorkflowActionType.Create.ToLowerString(),
                    handler=requestor,
                    process_time = now,
                    remark = null
                };
                db.qdt_workflow_action.AddObject(workflowAction);


                foreach (var route in db.qdt_workflow_route.Where(n => n.workflow_id == Id).OrderBy(n => n.step))
                {
                    var process = new qdt_workflow_process()
                    {
                        name = route.name,
                        request_id = requestId,
                        step = route.step
                    };
                    if (route.step == 0)
                    {
                        process.start_time = now;
                        process.status = WorkflowProcessStatus.Pending.ToLowerString();
                    }
                    else
                    {
                        process.status = WorkflowProcessStatus.Open.ToLowerString();
                    }
                    db.qdt_workflow_process.AddObject(process);
                }

                //add default approvers
                foreach (var da in db.qdt_workflow_approver.Where(n => n.request_id == 0 && n.workflow_id == Id))
                {
                    var approver = new qdt_workflow_approver()
                    {
                        approver_id = da.approver_id,
                        request_id = requestId,
                        step = da.step,
                        workflow_id = Id
                    };
                    db.qdt_workflow_approver.AddObject(approver);
                }

                db.SaveChanges();
                return request;
            }
        }



        public static void CancelRequest(int requestId, string remark, int? userId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var request = db.qdt_workflow_request.Single(n => n.id == requestId);

                int currentStep = request.current_step.Value;
                if (request.status == WorkflowRequestStatus.Open.ToLowerString())
                {
                    request.status = WorkflowRequestStatus.Canceled.ToLowerString();
                    var certification = db.qdt_tq_certification.Single(n => n.request_id == requestId);
                    certification.status = CertificationStatus.Canceled.ToLowerString();
                    var followingProcess = db.qdt_workflow_process.Where(n => n.request_id == requestId && n.step >= currentStep);
                    foreach (var process in followingProcess)
                    {
                        process.status = WorkflowProcessStatus.Canceled.ToLowerString();
                    }
                    var action = new qdt_workflow_action()
                    {
                        action_target = WorkflowActionTarget.Request.ToLowerString(),
                        handler = userId,
                        process_action = WorkflowActionType.Cancel.ToLowerString(),
                        process_time = DateTime.Now,
                        target_id = requestId,
                        remark = remark
                    };
                    db.qdt_workflow_action.AddObject(action);
                    db.SaveChanges();

                    if (certification.category.Equals(CertificationCategory.STC.ToLowerString()))
                    {
                        // Send notification
                        object[] args = new object[2];
                        args[0] = certification.id;
                        args[1] = db.qdt_workflow_process.Single(n => n.request_id == requestId && n.step == currentStep).id;
                        HtmlMailController.SendNotification(EmailType.QdtStcSkillCanceled, args);
                    }
                    else if (certification.category.Equals(CertificationCategory.LLC.ToLowerString()))
                    {
                        //Send notification for lesson learnt
                    }

                }
                else
                {
                    throw new Exception(ProgramStringKey.txtStatusNotOpen.ToString());
                }
            }
        }

        public static bool ApproveWorkflowProcess(int currentProcessId, int approverId, string remark)
        {
            using (QDTEntities db = new QDTEntities())
            {
                DateTime currentTime = DateTime.Now;
                WorkflowActionType processAction = WorkflowActionType.Approve;
                var currentProcess = db.qdt_workflow_process.Single(n => n.id == currentProcessId);

                int requestId = currentProcess.request_id;
                var request = db.qdt_workflow_request.Single(n => n.id == requestId);
                var certification = db.qdt_tq_certification.Single(n => n.request_id == requestId);

                var approvers = db.qdt_workflow_approver.Where(n => n.request_id == requestId && n.step == request.current_step).ToList();
                //check if handler is one of process owner
                if (approvers.Any(n => n.approver_id == approverId))
                {
                    DateTime approveTime = currentTime;

                    currentProcess.end_time = currentTime;
                    currentProcess.status = WorkflowProcessStatus.Approved.ToLowerString();
                    db.SaveChanges();

                    var action = new qdt_workflow_action()
                    {
                        action_target = WorkflowActionTarget.Process.ToLowerString(),
                        target_id = currentProcess.id,
                        handler = approverId,
                        process_action = processAction.ToLowerString(),
                        process_time = approveTime,
                        remark = remark
                    };
                    db.qdt_workflow_action.AddObject(action);
                    db.SaveChanges();

                    //this is the last step
                    if (!db.qdt_workflow_process.Any(n => n.request_id == requestId && n.step == request.current_step + 1))
                    {
                        request.status = WorkflowRequestStatus.Closed.ToLowerString();
                        request.end_time = approveTime;
                      //  request.current_step = null;
                        Certification.GrantCertification(requestId);
                        db.SaveChanges();

                        if (certification.category.Equals(CertificationCategory.LLC.ToLowerString()))
                        {
                            //Send email to trainee that the ll certification is granted
                            object[] args = new object[2];
                            args[0] = certification.id;
                            args[1] = currentProcessId;
                            HtmlMailController.SendNotification(EmailType.QdtLlCertificationGranted, args);
                        }


                        if (certification.category.Equals(CertificationCategory.STC.ToLowerString()))
                        {
                            //Send email to trainee that the stc certification is granted
                            object[] args = new object[2];
                            args[0] = certification.id;
                            args[1] = currentProcessId;
                            HtmlMailController.SendNotification(EmailType.QdtStcCertificationGranted, args);
                        }
                    }

                    //this is not the last step
                    else
                    {
                        var nextStep = request.current_step + 1;
                        request.current_step = nextStep;
                        var nextProcess = db.qdt_workflow_process.Single(n => n.request_id == requestId && n.step == nextStep);
                        nextProcess.status = WorkflowProcessStatus.Pending.ToLowerString();
                        nextProcess.start_time = approveTime;
                        db.SaveChanges();

                        if (certification.category.Equals(CertificationCategory.LLC.ToLowerString()))
                        {
                            //Send Email to trainee that the certification process are moved to Next Process
                            //Send Email to next process approver
                            object[] args = new object[3];
                            args[0] = certification.id;
                            args[1] = currentProcessId;
                            args[2] = nextProcess.id;
                            HtmlMailController.SendNotification(EmailType.QdtLlCertificationInProcess, args);
                        }


                        else if (certification.category.Equals(CertificationCategory.STC.ToLowerString()))
                        {
                            //Send Email to trainee that the certification process are moved to Next Process
                            //Send Email to next process approver
                            object[] args = new object[3];
                            args[0] = certification.id;
                            args[1] = currentProcessId;
                            args[2] = nextProcess.id;
                            HtmlMailController.SendNotification(EmailType.QdtStcCertificationInProcess, args);
                        }

                    }

                    return true;
                }
                else
                {
                    return false;
                }
            }
        }


        public static bool SendBackWorkflowProcess(int currentProcessId, int approverId, string remark)
        {


            using (QDTEntities db = new QDTEntities())
            {
                DateTime currentTime = DateTime.Now;

                int requestId = db.qdt_workflow_process.Single(n => n.id == currentProcessId).request_id;

                var request = db.qdt_workflow_request.Single(n => n.id == requestId);
                if (request.current_step == 0)
                {
                    return false;
                }

                var currentProcess =
                 db.qdt_workflow_process.Single(n => n.request_id == requestId && n.step == request.current_step);

                var certification = db.qdt_tq_certification.Single(n => n.request_id == requestId);

                var approvers = db.qdt_workflow_approver.Where(n => n.request_id == requestId && n.step == request.current_step).ToList();
                //check if handler is one of process owner
                if (approvers.Any(n => n.approver_id == approverId))
                {

                    var action = new qdt_workflow_action()
                    {
                        action_target = WorkflowActionTarget.Process.ToLowerString(),
                        target_id = currentProcess.id,
                        handler = approverId,
                        process_action = WorkflowActionType.Reject.ToLowerString(),
                        process_time = currentTime,
                        remark = remark
                    };
                    db.qdt_workflow_action.AddObject(action);
                    db.SaveChanges();


                    if (!db.qdt_workflow_process.Any(n => n.request_id == requestId && n.step == request.current_step - 1))
                    {
                        throw new Exception(ProgramStringKey.txtThisIsTheFirstProcessCannotBeSendBack.ToString());
                    }
                    else
                    {
                        currentProcess.start_time = null;
                        currentProcess.status = WorkflowProcessStatus.Open.ToLowerString();
                        var prevStep = request.current_step - 1;
                        request.current_step = prevStep;
                        var prevProcess = db.qdt_workflow_process.Single(n => n.request_id == requestId && n.step == prevStep);
                        prevProcess.status = WorkflowProcessStatus.Pending.ToLowerString();
                        prevProcess.start_time = currentTime;
                        prevProcess.end_time = null;

                        db.SaveChanges();

                        if (certification.category.Equals(CertificationCategory.LLC.ToLowerString()))
                        {
                            //send email to trainee and previous step approvers people
                            object[] args = new object[3];
                            args[0] = certification.id;
                            args[1] = currentProcess.id;
                            args[2] = prevProcess.id;
                            HtmlMailController.SendNotification(EmailType.QdtLlCertificationInProcess, args);
                        }
                        else if (certification.category.Equals(CertificationCategory.STC.ToLowerString()))
                        {
                            //send email to related people
                            object[] args = new object[3];
                            args[0] = certification.id;
                            args[1] = currentProcessId;
                            args[2] = prevProcess.id;

                            HtmlMailController.SendNotification(EmailType.QdtStcCertificationInProcess, args);
                        }

                    }
                    return true;
                }
                else
                {
                    return false;

                }
            }
        }

        public static List<qdt_workflow_process> GetProcesses(int requestId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var processes = db.qdt_workflow_process.Where(n => n.request_id == requestId).ToList();
                return processes;
            }
        }


        public static List<qdtTqGetUserProcessApprovalsSp_Result> GetUserProcessApprovals(int userId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                return db.qdtTqGetUserProcessApprovalsSp(userId).ToList();
            }
        }


        public static List<qdt_workflow_action> GetWorkflowActions(string actionTarget, int targetId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                return db.qdt_workflow_action.Where(n => n.action_target == actionTarget && n.target_id == targetId).ToList();
            }
        }

        public static void UpdateApprovers(int requestId, List<qdt_workflow_approver> approvers)
        {

            //TODO: only change allow_custom_approver approvers
            using (QDTEntities db = new QDTEntities())
            {
                var request = db.qdt_workflow_request.Single(n => n.id == requestId);
                foreach (var process in db.qdt_workflow_process.Where(n => n.request_id == requestId).ToList())
                {
                    if (process.status == WorkflowProcessStatus.Open.ToLowerString() || process.status == WorkflowProcessStatus.Pending.ToLowerString())
                    {
                        foreach (var oldApprover in db.qdt_workflow_approver.Where(n => n.request_id == requestId && n.step == process.step).ToList())
                        {
                            db.qdt_workflow_approver.DeleteObject(oldApprover);
                        }
                        db.SaveChanges();
                        foreach (var newApprover in approvers.Where(n => n.step == process.step).ToList())
                        {
                            newApprover.request_id = requestId;
                            newApprover.workflow_id = request.workflow_id.Value;
                            db.qdt_workflow_approver.AddObject(newApprover);
                        }
                        db.SaveChanges();
                    }
                }
               
            }
        }


        public static List<qdt_workflow_approver> GetApproverByProcessId(int processId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var process = db.qdt_workflow_process.Single(n => n.id == processId);
                var approvers = db.qdt_workflow_approver.Where(n => n.request_id == process.request_id && n.step == process.step).ToList();
                return approvers;
            }
        }

    }
}