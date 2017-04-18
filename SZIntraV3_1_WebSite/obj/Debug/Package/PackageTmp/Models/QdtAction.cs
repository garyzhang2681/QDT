using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using System.IO;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtAction
    {

        public enum ActionStatus
        {
            Open,
            Approved,
            Completed,
            Reviewed,
            Reject
        }

        public qdt_action action { get; set; }

        public HrEmployee owner { get; set; }
        public QdtDiscrepancyReport dr { get; set; }
        public QdtDisposition disposition { get; set; }
        public QdtUser createBy { get; set; }
        public QdtUser updateBy { get; set; }
        public QdtCommonString actionType { get; set; }

        public List<QdtDiscrepancy> discrepancies { get; set; }

        public QdtAction(qdt_action action)
        {
            this.action = action;

            //this.act_id = action.act_id;
            //this.act_owner = action.act_owner;
            //this.act_type = action.act_type;
            //this.create_by = action.create_by;
            //this.create_date = action.create_date;
            //this.ct_action = action.ct_action;
            //this.description = action.description;
            //this.disp_id = action.disp_id;
            //this.dr_num = action.dr_num;
            //this.due_date = action.due_date;
            //this.lt_action = action.lt_action;
            //this.remark = action.remark;
            //this.st_action = action.st_action;
            //this.status = action.status;
            //this.update_by = action.update_by;
            //this.update_date = action.update_date;

        }

      


        public static Dictionary<ActionStatus, string> ActionStatuses = new Dictionary<ActionStatus, string>()
        {
            {ActionStatus.Open, "open"},
            {ActionStatus.Approved, "approved"},
            {ActionStatus.Completed, "completed"},
            {ActionStatus.Reviewed, "reviewed"},
            {ActionStatus.Reject, "reject"}
        };


        public void InitialProperties()
        {
            disposition = QdtDisposition.GetDispositionById(action.disp_id);
            owner = HrEmployee.GetEmployeeById(action.act_owner.Value);
            createBy = QdtUser.GetUserById(Convert.ToInt32(action.create_by));
            updateBy = QdtUser.GetUserById(Convert.ToInt32(action.update_by));
            dr = QdtDiscrepancyReport.GetDrById(action.dr_num);
            actionType = QdtCommonString.GetRecordById(action.act_type);
            ;
            discrepancies = QdtDiscrepancy.GetDiscrepanciesByDrNumber(action.dr_num);
        }

    }
}