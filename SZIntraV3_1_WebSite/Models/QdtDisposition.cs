using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{

    public enum DispositionStatus
    {
        Create,
        Open,
        Running,
        Completed,
        Reviewed,
        Success,
        Failure,
        Reject
    }

    public class QdtDisposition
    {
        public qdt_disposition disposition { get; set; }

        public QdtDiscrepancyReport dr { get; set; }
        public QdtUser createBy { get; set; }
        public QdtUser upeateBy { get; set; }
        public QdtCommonString dispType { get; set; }
        public QdtCommonString reasonType { get; set; }
        public QdtCommonString responsibleDepartment { get; set; }

        public List<QdtDiscrepancy> discrepancies { get; set; }

        public QdtDisposition(qdt_disposition disposition)
        {
            this.disposition = disposition;
            discrepancies = new List<QdtDiscrepancy>();
        }

        public static Dictionary<DispositionStatus, string> DispositionStatuses = new Dictionary<DispositionStatus, string>()
        {
            {DispositionStatus.Create,"create"},
            {DispositionStatus.Open,"open"},
            {DispositionStatus.Running,"running"},
            {DispositionStatus.Completed,"completed"},
            {DispositionStatus.Reviewed,"reviewed"},
            {DispositionStatus.Success,"success"},
            {DispositionStatus.Failure,"failure"},
            {DispositionStatus.Reject,"reject"}
        };


        public static List<qdt_disposition> GetDispositionsByDrNumber(string dr_num)
        {
         
            return new QDTEntities().qdt_disposition.Where(n => n.dr_num == dr_num).ToList();
        }


        public static QdtDisposition GetDispositionById(int id)
        {
            return new QdtDisposition(new QDTEntities().qdt_disposition.Single(n => n.disp_id == id));
        }

        public void InitialProperties()
        {
            var db = new QDTEntities();
            dr = QdtDiscrepancyReport.GetDrById(disposition.dr_num);
            createBy = QdtUser.GetUserById(disposition.create_by.Value);
            upeateBy = QdtUser.GetUserById(disposition.update_by.Value);
            dispType = QdtCommonString.GetRecordById(disposition.disp_type);
            reasonType = QdtCommonString.GetRecordById(disposition.reason.Value);
            responsibleDepartment = QdtCommonString.GetRecordById(disposition.responsible_department.Value);

            foreach (var disc_disp in db.qdt_disc_disp.Where(n => n.disp_id == disposition.disp_id).ToList())
            {
                qdt_discrepancy disc = db.qdt_discrepancy.Single(n => n.disc_id == disc_disp.disc_id);
                discrepancies.Add(new QdtDiscrepancy(disc));
            }
        }
    }
}