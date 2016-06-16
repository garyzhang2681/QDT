using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Hosting;
using SZIntraV3_1_WebSite.Models;
using System.IO;
using RazorEngine;
using System.Net.Mail;
using System.Text;
using SZIntraV3_1_WebSite.Utility;
using SZIntraV3_1_WebSite.Models.EntityModel;
using System.Net;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using System.Threading;
using SZIntraV3_1_WebSite.Models.Ll;
using SuzhouHr.Models.EntityModel;
using Common.Utility.Extension;
using SZIntraV3_1_WebSite.Models.System;
using SZIntraV3_1_WebSite.Models.Tq;

namespace SZIntraV3_1_WebSite.Controllers
{
    public class HtmlMailController : Controller
    {
        public static string TemplatePath = HostingEnvironment.MapPath("~/Views/HtmlMail");

        public static string GetMailBody<T>(EmailType emailType, T model)
        {
            var path = Path.Combine(TemplatePath, string.Format("{0}.cshtml", emailType));
            var template = System.IO.File.ReadAllText(path);
            return Razor.Parse(template, model);
        }

        private static MailMessage BuildMailMessage(string from, string to, string subject, string body)
        {
            return Email.BuildMailMessage(from, to, subject, body, UTF8Encoding.UTF8, true, DeliveryNotificationOptions.OnFailure);
        }


        public static void SendMail(SmtpClient client, string to, string subject, string body)
        {
            //var to = string.Join(";", toAddresses);
            //TODO: get from user from client credential
            MailMessage message = BuildMailMessage("functional.suzhouautomail@ge.com", to, subject, body);
            try
            {
                client.Send(message);
            }
            catch (Exception e)
            {
                
            }
        }


        #region mail content test
        public ActionResult QdtNewDiscrepancyReport()
        {
            var dr = new QdtDiscrepancyReport(new QDTEntities().qdt_dr.First());
            dr.InitialProperties();
            return View(dr);
        }


        public ActionResult QdtAction()
        {
            var action = new QdtAction(new QDTEntities().qdt_action.First());
            action.InitialProperties();
            return View(action);
        }
        #endregion


        #region Email Subjects
        private static string QDTDRSYSTEM = " - DR System( Quality Digitalization Tools)";
        private static string QDTLLSYSTEM = " - LL System( Quality Digitalization Tools)";
        private static string QDTTQSYSTEM = " - TQ System( Quality Digitalization Tools)";
        public static Dictionary<EmailType, string> MailSubject = new Dictionary<EmailType, string> {
            {EmailType.QdtNewDiscrepancyReport,"New Discrepancy Report is Submitted"+QDTDRSYSTEM},
            {EmailType.QdtDispositionCreated, "New Disposition is Created"+QDTDRSYSTEM},
            {EmailType.QdtActionCreated,"New DR Action is Created"+QDTDRSYSTEM},
            {EmailType.QdtActionReleased,"New DR Action is Released"+QDTDRSYSTEM},
            {EmailType.QdtActionUpdated,"DR Action is Updated"+QDTDRSYSTEM},
            {EmailType.QdtActionAllCompleted,"All Actions are Completed"+QDTDRSYSTEM},
            {EmailType.QdtDispositionReviewed,"DR Disposition is Reviewed"+QDTDRSYSTEM},
            {EmailType.QdtDiscrepancyReportClosed,"Discrepancy Report is Closed"+QDTDRSYSTEM},
            {EmailType.QdtDispositionRejected, "Disposition is Rejected" + QDTDRSYSTEM},
            {EmailType.QdtLlCertificationCreated, "New Lesson is Released" + QDTLLSYSTEM},
            {EmailType.QdtLlCertificationGranted, "Training is Finished" + QDTLLSYSTEM},
            {EmailType.QdtLlCertificationInProcess, "Lesson Learnt Certification In Process" + QDTLLSYSTEM},
            {EmailType.QdtStcSkillCreated,"New Skill Training is Created"  + QDTTQSYSTEM},
            {EmailType.QdtStcSkillCanceled,"Training Request is Canceled"  + QDTTQSYSTEM},
            {EmailType.QdtStcCertificationGranted,"Training is Finished"  + QDTTQSYSTEM},
            {EmailType.QdtStcCertificationInProcess,"Skill Training Certification In Process"  + QDTTQSYSTEM},
            {EmailType.QdtTqDirectCertificationCreated,"Certification Is Directely Granted To You"  + QDTTQSYSTEM}
            
        };

        #endregion




        /// <summary>
        /// Send notifiaction to receipts according to notification type
        /// </summary>
        /// <param name="emailType">The notification type</param>
        /// <param name="arg">Reference to create email model, e.g. dr_num, act_id etc.</param>
        public static void SendNotification(EmailType emailType, object[] args)
        {
            try
            {
                dynamic model = null;
                var toAddresses = new List<string>();
                var ccAddresses = new List<string>();
                switch (emailType)
                {
                    case EmailType.QdtNewDiscrepancyReport:
                    {

                        var drNum = args[0].ToString();
                        var dr = new QdtDiscrepancyReport(new QDTEntities().qdt_dr.Single(n => n.dr_num == drNum));
                        dr.InitialProperties();
                        toAddresses.Add(dr.qeOwner.employee.email);
                        toAddresses.Add(dr.meOwner.employee.email);
                        model = dr;
                        break;
                    }
                    case EmailType.QdtDispositionCreated:
                    {

                        var dispId = Convert.ToInt32(args[0].ToString());
                        var disposition =
                            new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == dispId));
                        disposition.InitialProperties();
                        disposition.dr.InitialProperties();
                        toAddresses.Add(disposition.dr.qeOwner.employee.email);
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
                        var actId = Convert.ToInt32(args[0]);
                        var action = new QdtAction(new QDTEntities().qdt_action.Single(n => n.act_id == actId));
                        action.InitialProperties();
                        action.dr.InitialProperties();
                        toAddresses.Add(action.owner.employee.email);
                        model = action;
                        break;
                    }
                    case EmailType.QdtActionUpdated:
                    {
                        var actId = Convert.ToInt32(args[0]);
                        var action = new QdtAction(new QDTEntities().qdt_action.Single(n => n.act_id == actId));
                        action.InitialProperties();
                        action.dr.InitialProperties();
                        toAddresses.Add(action.dr.qeOwner.employee.email);
                        model = action;
                        break;
                    }
                    case EmailType.QdtActionAllCompleted:
                    {
                        var dispId = Convert.ToInt32(args[0]);
                        var disposition =
                            new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == dispId));
                        disposition.InitialProperties();
                        disposition.dr.InitialProperties();
                        toAddresses.Add(disposition.dr.qeOwner.employee.email);
                        toAddresses.Add(disposition.dr.meOwner.employee.email);
                        model = disposition;
                        break;
                    }
                    case EmailType.QdtDispositionReviewed:
                    {

                        var disp_id = Convert.ToInt32(args[0]);
                        var disposition =
                            new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == disp_id));
                        disposition.InitialProperties();
                        disposition.dr.InitialProperties();
                        toAddresses.Add(disposition.dr.meOwner.employee.email);
                        model = disposition;
                        break;
                    }
                    case EmailType.QdtDispositionRejected:
                    {
                        var dispId = Convert.ToInt32(args[0]);
                        var disposition =
                            new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == dispId));
                        disposition.InitialProperties();
                        disposition.dr.InitialProperties();
                        toAddresses.Add(disposition.dr.meOwner.employee.email);
                        model = disposition;
                        break;
                    }
                    case EmailType.QdtDiscrepancyReportClosed:
                    {
                        var drNum = args[0].ToString();
                        var dr = new QdtDiscrepancyReport(new QDTEntities().qdt_dr.Single(n => n.dr_num == drNum));
                        dr.InitialProperties();
                        toAddresses.Add(dr.qeOwner.employee.email);
                        toAddresses.Add(dr.meOwner.employee.email);
                        model = dr;
                        break;
                    }

                    case EmailType.QdtLlCertificationCreated:
                    {
                        var certificationId = Convert.ToInt32(args[0]);
                        var nextProcessId = Convert.ToInt32(args[1]);
                        string actionTarget = WorkflowActionTarget.Request.ToLowerString();

                        VmQdtLlWorkflowRequest qlwr = new VmQdtLlWorkflowRequest(actionTarget, certificationId, -1,
                            nextProcessId);
                        model = qlwr;
                        toAddresses.Add(
                            VmNativeUser.GetNativeUserByEmployeeId(qlwr.workflowRequest.request_for.Value).email);
                        toAddresses.Add(VmNativeUser.GetNativeUserByUserId(qlwr.workflowRequest.requestor.Value).email);

                        foreach (var approver in qlwr.approvers[0])
                        {
                            toAddresses.Add(VmNativeUser.GetNativeUserByUserId(approver.user_id).email);
                        }


                        break;
                    }


                    case EmailType.QdtLlCertificationGranted:
                    {
                        using (SuzhouHrEntities hr = new SuzhouHrEntities())
                        using (QDTEntities db = new QDTEntities())
                        {
                            var certificationId = Convert.ToInt32(args[0]);
                            var currentProcessId = Convert.ToInt32(args[1]);

                            string actionTarget = WorkflowActionTarget.Process.ToLowerString();

                            VmQdtLlWorkflowRequest qlwr = new VmQdtLlWorkflowRequest(actionTarget, certificationId,
                                currentProcessId);
                            model = qlwr;

                            toAddresses.Add(
                                VmNativeUser.GetNativeUserByEmployeeId(qlwr.workflowRequest.request_for.Value).email);
                            toAddresses.Add(
                                VmNativeUser.GetNativeUserByUserId(qlwr.workflowRequest.requestor.Value).email);


                            break;
                        }
                    }

                    case EmailType.QdtLlCertificationInProcess:
                    {

                        var certificationId = Convert.ToInt32(args[0]);
                        var currentProcessId = Convert.ToInt32(args[1]);
                        var nextProcessId = Convert.ToInt32(args[2]);

                        string actionTarget = WorkflowActionTarget.Process.ToLowerString();

                        VmQdtLlWorkflowRequest qlwr = new VmQdtLlWorkflowRequest(actionTarget, certificationId,
                            currentProcessId, nextProcessId);
                        model = qlwr;

                        toAddresses.Add(
                            VmNativeUser.GetNativeUserByEmployeeId(qlwr.workflowRequest.request_for.Value).email);
                        toAddresses.Add(VmNativeUser.GetNativeUserByUserId(qlwr.workflowRequest.requestor.Value).email);


                        foreach (var nextApprover in qlwr.approvers[qlwr.workflowRequest.current_step.Value])
                        {
                            toAddresses.Add(VmNativeUser.GetNativeUserByUserId(nextApprover.user_id).email);
                        }


                        break;

                    }
                    case EmailType.QdtStcSkillCreated:
                    {
                        var certificationId = Convert.ToInt32(args[0]);
                        var nextProcessId = Convert.ToInt32(args[1]);

                        string actionTraget = WorkflowActionTarget.Request.ToLowerString();
                        VmQdtStcWorkflowRequest wp = new VmQdtStcWorkflowRequest(actionTraget, certificationId, -1,
                            nextProcessId);
                        model = wp;

                        toAddresses.Add(
                            VmNativeUser.GetNativeUserByEmployeeId(wp.workflowRequest.request_for.Value).email);
                        toAddresses.Add(VmNativeUser.GetNativeUserByUserId(wp.workflowRequest.requestor.Value).email);

                        foreach (var approver in wp.approvers[0])
                        {
                            toAddresses.Add(VmNativeUser.GetNativeUserByUserId(approver.user_id).email);
                        }

                        break;
                    }

                    case EmailType.QdtStcCertificationInProcess:
                    {
                        var certificationId = Convert.ToInt32(args[0]);
                        var currentProcessId = Convert.ToInt32(args[1]);
                        var nextProcessId = Convert.ToInt32(args[2]);

                        string actionTraget = WorkflowActionTarget.Process.ToLowerString();
                        VmQdtStcWorkflowRequest wp = new VmQdtStcWorkflowRequest(actionTraget, certificationId,
                            currentProcessId, nextProcessId);
                        model = wp;

                        toAddresses.Add(
                            VmNativeUser.GetNativeUserByEmployeeId(wp.workflowRequest.request_for.Value).email);
                        toAddresses.Add(VmNativeUser.GetNativeUserByUserId(wp.workflowRequest.requestor.Value).email);


                        foreach (var nextApprover in wp.approvers[wp.workflowRequest.current_step.Value])
                        {
                            toAddresses.Add(VmNativeUser.GetNativeUserByUserId(nextApprover.user_id).email);
                        }

                        break;

                    }



                    case EmailType.QdtStcSkillCanceled:
                    {
                        var certificationId = Convert.ToInt32(args[0]);
                        var currentProcessId = Convert.ToInt32(args[1]);

                        string actionTraget = WorkflowActionTarget.Request.ToLowerString();
                        VmQdtStcWorkflowRequest wp = new VmQdtStcWorkflowRequest(actionTraget, certificationId,
                            currentProcessId);
                        model = wp;

                        toAddresses.Add(
                            VmNativeUser.GetNativeUserByEmployeeId(wp.workflowRequest.request_for.Value).email);
                        toAddresses.Add(VmNativeUser.GetNativeUserByUserId(wp.workflowRequest.requestor.Value).email);
                        //foreach (var stepApprovers in wp.approvers)
                        //{
                        //    //workflow之后的step需要发送给approver
                        //    if (stepApprovers.Key >= wp.workflowRequest.current_step)
                        //    {
                        //        foreach (var approver in stepApprovers.Value)
                        //        {
                        //            toAddresses.Add(VmNativeUser.GetNativeUserByUserId(approver.user_id).email);
                        //        }
                        //    }
                        //    else//workflow之前的step需要cc给approver
                        //    {
                        //        foreach (var approver in stepApprovers.Value)
                        //        {
                        //            ccAddresses.Add(VmNativeUser.GetNativeUserByUserId(approver.user_id).email);
                        //        }
                        //    }
                        //}
                        break;
                    }

                    case EmailType.QdtStcCertificationGranted:
                    {
                        var certificationId = Convert.ToInt32(args[0]);
                        var currentProcessId = Convert.ToInt32(args[1]);

                        string actionTraget = WorkflowActionTarget.Process.ToLowerString();
                        VmQdtStcWorkflowRequest wp = new VmQdtStcWorkflowRequest(actionTraget, certificationId,
                            currentProcessId);
                        model = wp;

                        toAddresses.Add(
                            VmNativeUser.GetNativeUserByEmployeeId(wp.workflowRequest.request_for.Value).email);
                        toAddresses.Add(VmNativeUser.GetNativeUserByUserId(wp.workflowRequest.requestor.Value).email);

                        break;

                    }
                    case EmailType.QdtTqDirectCertificationCreated:
                    {
                        var certificationId = Convert.ToInt32(args[0]);
                        VmDirectCertification dc = new VmDirectCertification(certificationId);
                        model = dc;
                        toAddresses.Add(VmNativeUser.GetNativeUserByUserId(dc.certification.employee_id.Value).email);
                        toAddresses.Add(VmNativeUser.GetNativeUserByUserId(dc.action.handler.Value).email);
                        break;
                    }


                    default:
                        break;
                }

                toAddresses = toAddresses.Distinct().ToList();
                ccAddresses = ccAddresses.Distinct().ToList();
                Thread sendMailsThread = new Thread(() => SendMails(toAddresses, ccAddresses, emailType, model));
                sendMailsThread.Priority = ThreadPriority.Lowest;
                sendMailsThread.Start();
            }
            catch
            {
                return;
            }
           
        }

        public static void SendMails(List<string> receivers, EmailType emailType, dynamic model)
        {
            foreach (string receiver in receivers)
            {
                HtmlMailController.SendMail(Email.GetSuzhouAutoMailClient(), receiver, HtmlMailController.MailSubject[emailType], HtmlMailController.GetMailBody(emailType, model));
            }
        }

        public static void SendMails(List<string> toAddresses, List<string> ccAddresses, EmailType emailType, dynamic model)
        {
            try
            {
                MailMessage message = new MailMessage();
                foreach (string ccAddress in ccAddresses)
                {
                    message.CC.Add(new MailAddress(ccAddress));
                }

                foreach (string toAddress in toAddresses)
                {
                    message.To.Add(new MailAddress(toAddress));
                }
                message.From = new MailAddress("functional.suzhouautomail@ge.com");
                message.Subject = HtmlMailController.MailSubject[emailType];
                message.Body = HtmlMailController.GetMailBody(emailType, model);
                message.BodyEncoding = UTF8Encoding.UTF8;
                message.IsBodyHtml = true;
                message.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
                Email.GetSuzhouAutoMailClient().Send(message);
            }
            catch
            {

            }
        }
    }
}
