using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{


    public enum IrdRevisionStatus
    {
        Unprepared,
        Prepared,
        Unverified,
        Verified,
        Unapproved,
        Approved,
        VerifyDeny,
        ApproveDeny
    }
    public class QdtIrdRevision
    {
        public qdt_ird_revision ird_revision { get; set; }

        public HrEmployee preparedBy { get; set; }
        public HrEmployee verifiedBy { get; set; }
        public HrEmployee approvedBy { get; set; }

        public static Dictionary<IrdRevisionStatus,string> IrdRevisionStatuses = new Dictionary<IrdRevisionStatus,string> 
        {
            {IrdRevisionStatus.Unprepared,"unprepared"},
            {IrdRevisionStatus.Prepared,"prepared"},
            {IrdRevisionStatus.Unverified,"unverified"},
            {IrdRevisionStatus.Verified,"verified"},
            {IrdRevisionStatus.VerifyDeny,"verify deny"},
            {IrdRevisionStatus.Unapproved,"unapproved"},
            {IrdRevisionStatus.Approved,"approved"},
            {IrdRevisionStatus.ApproveDeny,"approve deny"}
        
        };

        public QdtIrdRevision()
        { }

        public QdtIrdRevision(qdt_ird_revision ird_revision)
        {
            this.ird_revision = ird_revision;
        }

        public static QdtIrdRevision GetIrdRevisionById(int? ird_id)
        {
            return new QdtIrdRevision(new QDTEntities().qdt_ird_revision.Single(n => n.ird_id == ird_id));
        }
        public void InitialProperties()
        {
            preparedBy = HrEmployee.GetEmployeeById(ird_revision.prepare_by.Value);
            verifiedBy = HrEmployee.GetEmployeeById(ird_revision.verify_by.Value);
            approvedBy = HrEmployee.GetEmployeeById(ird_revision.approve_by.Value);
        }
    }
}