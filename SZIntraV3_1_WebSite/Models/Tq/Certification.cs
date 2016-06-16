using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.ConstrainedExecution;
using System.Web;
using NPOI.SS.Formula.Functions;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using SZIntraV3_1_WebSite.Controllers;
using SZIntraV3_1_WebSite.Utility;
using Common.Utility.Extension;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public class Certification
    {
        public static int? InitialCertification(int? certicationItemId, string certificationItem, CertifyMode certifyMode, int employeeId, int requestId, CertificationCategory category)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var certification = new qdt_tq_certification()
                {
                    category = category.ToString().ToLower(),
                    certification_item_id = certicationItemId,
                    certification_item = certificationItem,
                    certify_mode = certifyMode.ToString().ToLower(),
                    employee_id = employeeId,
                    request_id = requestId,
                    status = CertificationStatus.Pending.ToString().ToLower()
                };
                db.qdt_tq_certification.AddObject(certification);
                db.SaveChanges();
                return certification.id;
            }
        }




        public static List<qdt_tq_certification> GetCertifications(string category, int? workingGroupId, int? employeeId, int? certificationItemId, bool filterStatus, List<string> statusList, string query)
        {
            //TODO: filter working group
            using (QDTEntities db = new QDTEntities())
            {
                var result = db.qdt_tq_certification.Where(n =>
                    ((category == "") || n.category.Equals(category)) &&
                    (!employeeId.HasValue || n.employee_id == employeeId) &&
                    (!certificationItemId.HasValue || n.certification_item_id == certificationItemId) &&
                    (!filterStatus || statusList.Contains(n.status)) &&
                    (n.certification_item == null || n.certification_item.ToLower().Contains(query))).ToList();
                return result;

            }
        }


        public static void GrantCertification(int requestId)
        {
            using (QDTEntities db = new QDTEntities())
            {


                DateTime currentTime = DateTime.Now;
                if (db.qdt_tq_certification.Any(n => n.request_id == requestId))
                {
                    string activeText = CertificationStatus.Active.ToLowerString(),
                            pendingText = CertificationStatus.Pending.ToLowerString();
                    var certification = db.qdt_tq_certification.Single(n => n.request_id == requestId);
                    var certification_item = certification.certification_item;
                    var certification_item_id = certification.certification_item_id;
                    //var skill =
                    //    db.qdt_tq_skill_code.Single(
                    //        n => n.id == certification_item_id && n.skill_code.Equals(certification_item));

                    certification.status = CertificationStatus.Active.ToLowerString();
                    certification.issue_date = currentTime;
                    certification.refresh_date = currentTime;

             
                    if (certification.category.ToLower() == CertificationCategory.STC.ToLowerString())
                    {
                        var workflowRequest = db.qdt_workflow_request.Single(n => n.id == requestId);
                        var workflowId = workflowRequest.workflow_id;
                        var workflowType = db.qdt_workflow.Single(n => n.id == workflowId).business;
                        if (workflowType.Equals(WorkflowType.Quality.ToLowerString()))
                        {
                            certification.is_trainer = true;
                        }

                        var trainerCertifications =
                            db.qdt_tq_certification.Where(
                                n =>
                                    n.certification_item.Equals(certification_item) &&
                                    n.certification_item_id == certification_item_id && n.is_trainer == true).ToList();

                        var trainerCertificationsCount = trainerCertifications.Where(
                            n => n.refresh_date.Value.AddDays((double)365) > workflowRequest.start_time.Value).ToList().Count();
                        if (trainerCertificationsCount >= 1 && certification.certify_mode.Equals("refresh"))
                        {
                            certification.is_trainer = true;
                        }

                        var skillCode =
                            db.qdt_tq_skill_code.Single(
                                n =>
                                    n.id == certification.certification_item_id &&
                                    n.skill_code.Equals(certification.certification_item));
                        var effecitiveTime = skillCode.effective_time;
                        if (effecitiveTime == null)
                        {
                            if (skillCode.invalid_time != null)
                            {
                                effecitiveTime = skillCode.invalid_time;
                            }
                            else
                            {
                                effecitiveTime = 365;
                            }
                        }

                        certification.expire_date = currentTime.AddDays((double)effecitiveTime);
                        foreach (var oc in db.qdt_tq_certification.Where(
                            n => n.category == certification.category &&
                                n.certification_item_id == certification.certification_item_id &&
                                n.employee_id == certification.employee_id &&
                                (n.status == activeText || n.status == pendingText) &&
                                n.request_id != requestId))
                        {
                            if (oc.status == activeText)
                            {
                                oc.status = CertificationStatus.Inactive.ToLowerString();
                            }
                            else if (oc.status == pendingText)
                            {
                                Workflow.CancelRequest(oc.request_id.Value, string.Empty, null);
                            }
                        }
                    }
                    db.SaveChanges();
                }
            }
        }


    }
}