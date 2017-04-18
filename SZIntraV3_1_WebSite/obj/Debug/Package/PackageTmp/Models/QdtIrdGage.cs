using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtIrdGage
    {
        public qdt_ird_gage irdGage { get; set; }

        public QdtIrdGage()
        {
        }

        public QdtIrdGage(qdt_ird_gage irdGage)
        {
            this.irdGage = irdGage;
        }

        public static QdtIrdGage GetIrdGageById(int ? gageId)
        {
            if (gageId != null)
            {
                return new QdtIrdGage(new QDTEntities().qdt_ird_gage.Single(n => n.gage_id == gageId));
            }
            else
            {
                return null;
            }
        }

        public void InitialProperties()
        {
        }

    }
}