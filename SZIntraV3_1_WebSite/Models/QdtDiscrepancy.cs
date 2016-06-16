using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtDiscrepancy
    {

      //  public static QDTEntities qdtEntities = new QDTEntities();

        public qdt_discrepancy discrepancy { get; set; }

        public QdtDiscrepancyReport dr { get; set; }

        public QdtDiscrepancy(qdt_discrepancy discrepancy)
        {
            this.discrepancy = discrepancy;
            //this.disc_id = discrepancy.disc_id;
            //this.dr_num = discrepancy.dr_num;
            //this.description = discrepancy.description;
        }

        public static QdtDiscrepancy GetDiscrepancyById(int disc_id)
        {
            var discrepancy = new QDTEntities().qdt_discrepancy.Single(n => n.disc_id == disc_id);
            return new QdtDiscrepancy(discrepancy);
        }

        public void InitialProperties()
        {
            dr = QdtDiscrepancyReport.GetDrById(discrepancy.dr_num);
        }

        public static List<QdtDiscrepancy> GetDiscrepanciesByDrNumber(string dr_num)
        {
            List<QdtDiscrepancy> list = new List<QdtDiscrepancy>();
            foreach (var discrepancy in new QDTEntities().qdt_discrepancy.Where(n => n.dr_num == dr_num))
            {
                list.Add(new QdtDiscrepancy(discrepancy));
            }
            return list;
        }


    }
}