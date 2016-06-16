using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class QdtIrdRoute
    {
        public qdt_ird_route ird_route { get; set; }

        public QdtIrdGage basicGage { get; set; }
        public QdtIrdGage fmlGage { get; set; }

        public QdtIrdRoute()
        {
        }

        public QdtIrdRoute(qdt_ird_route ird_route)
        {
            this.ird_route = ird_route;
        }

        public static QdtIrdRoute GetIrdRouteById(int ird_route_id)
        {
            return new QdtIrdRoute(new QDTEntities().qdt_ird_route.Single(n => n.ird_route_id == ird_route_id));
        }

        public void InitialProperties()
        {
            basicGage = QdtIrdGage.GetIrdGageById(ird_route.basic_gage_id.Value);
            fmlGage = QdtIrdGage.GetIrdGageById(ird_route.fml_gage_id.Value);
        }
    }
}