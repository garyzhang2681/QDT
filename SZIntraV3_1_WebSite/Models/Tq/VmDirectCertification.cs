using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Common.Utility.Extension;
using NPOI.SS.Formula.Functions;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public class VmDirectCertification
    {
        public qdt_tq_certification certification { get; set; }
        public qdt_tq_skill_code skillCode { get; set; }
        public qdt_ll_lesson lesson { get; set; }
        public qdt_workflow_action action { get; set; }


        public VmDirectCertification(int certificationId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                this.certification = db.qdt_tq_certification.Single(n => n.id == certificationId);

             
                if (certification.category.Equals(CertificationCategory.LLC.ToLowerString()))
                {
                    this.lesson =
                        db.qdt_ll_lesson.Single(
                            n =>
                                n.id == certification.certification_item_id &&
                                n.subject.Equals(certification.certification_item));
                }
                else if (certification.category.Equals(CertificationCategory.STC.ToLowerString()))
                {
                    this.skillCode =
                        db.qdt_tq_skill_code.Single(
                            n =>
                                n.id == certification.certification_item_id &&
                                n.skill_code.Equals(certification.certification_item));
                }

                string directCertificationS = WorkflowActionTarget.DirectCertification.ToLowerString();
                this.action = db.qdt_workflow_action.Single(n => n.action_target.Equals(directCertificationS) && n.target_id == certificationId);

            }
        }
    }
}