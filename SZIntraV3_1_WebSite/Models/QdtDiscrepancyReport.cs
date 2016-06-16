using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using System.IO;
using System.Diagnostics;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{

    public enum DrStatus
    {
    //    Open,
        Closed,
        PendingME,
        PendingQEME,
        PendingAction
    }


    public class QdtDiscrepancyReport
    {
        public static QDTEntities qdtEntities = new QDTEntities();

        public qdt_dr dr { get; set; }

        public QdtCommonString drType { get; set; }
        public HrEmployee qeOwner { get; set; }
        public HrEmployee meOwner { get; set; }
        public QdtUser closeBy { get; set; }
        public QdtUser createBy { get; set; }
        public QdtCommonString source { get; set; }
        public SlItem item { get; set; }

        public List<QdtDiscrepancy> discrepancies { get; set; }


        public static Dictionary<DrStatus, string> DrStatuses = new Dictionary<DrStatus, string>()
        {
      //      {DrStatus.Open,"open"},
            {DrStatus.Closed,"closed"},
            {DrStatus.PendingAction,"pending action"},
            {DrStatus.PendingME, "pending me"},
            {DrStatus.PendingQEME, "pending qeme"}
        };


     

        public QdtDiscrepancyReport()
        {
           
        }
        public QdtDiscrepancyReport(qdt_dr dr)
        {
            this.dr = dr;
            discrepancies = new List<QdtDiscrepancy>();
            //this.dr_num = dr.dr_num;
            //this.dr_type = dr.dr_type;
            //this.dr_qe_owner = dr.dr_qe_owner;
            //this.source = dr.source;
            //this.job = dr.job;
            //this.suffix = dr.suffix;
            //this.due_date = dr.due_date;
            //this.close_date = dr.close_date;
            //this.close_by = dr.close_by;
            //this.description = dr.description;
            //this.status = dr.status;
            //this.create_by = dr.create_by;
            //this.create_date = dr.create_date;
            //this.update_by = dr.update_by;
            //this.update_date = dr.update_date;
            //this.serial = dr.serial;
            //this.lot = dr.lot;
            //this.dr_me_owner = dr.dr_me_owner;
            //this.quantity = dr.quantity;
            //this.discrepancy_item = dr.discrepancy_item;
        }

        public static QdtDiscrepancyReport GetDrById(string dr_num)
        {
            return new QdtDiscrepancyReport(qdtEntities.qdt_dr.Single(n => n.dr_num == dr_num));
        }

        public void InitialProperties()
        {
            drType = QdtCommonString.GetRecordById(dr.dr_type.Value);
            qeOwner = HrEmployee.GetEmployeeById(dr.dr_qe_owner.Value);
            meOwner = HrEmployee.GetEmployeeById(dr.dr_me_owner.Value);
            source = QdtCommonString.GetRecordById(dr.source.Value);
            if (dr.close_by.HasValue)
            {
                closeBy = QdtUser.GetUserById(dr.close_by.Value);
            }
            createBy = QdtUser.GetUserById(dr.create_by.Value);
            discrepancies = QdtDiscrepancy.GetDiscrepanciesByDrNumber(dr.dr_num);
            item = SlItem.getItemByid(dr.discrepancy_item);
        }

    }




}