using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models.Inspection
{
    public class InspectionRecord
    {
        public static void UpdateInspectionPriority()
        {

            using (QDTEntities db = new QDTEntities())
            {
                db.qdtUpdateInspectionPrioritySP();
            }

        }
    }
}