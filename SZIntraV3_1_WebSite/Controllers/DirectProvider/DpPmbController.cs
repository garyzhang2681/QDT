using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using ProductionManagement.Models.EntityModel;
using Newtonsoft.Json.Linq;
using Common.Utility.Extension;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpPmbController : QdtBaseController
    {
        [DirectInclude]
        public ActionResult GetWorkCenters()
        {
            using (Pmb83Entities db = new Pmb83Entities())
            {
                var result = db.wcs.Select(n => new
                {
                    wc = n.wc1,
                    description = n.description
                }).ToList();
                return DirectSuccess(result);
            }
        }

        [DirectInclude]
        public ActionResult GetOperations(JObject o)
        {
            string query = o.GetString("query").Trim().ToLower();
            using (PmbEntities db = new PmbEntities())
            {
                var dbResult = db.sl_operation.Where(n => n.item.ToLower().Contains(query)).OrderBy(n => n.item).ThenBy(n => n.oper_num).AsQueryable();
                var data = PagedData(o, dbResult).ToList();
                return DirectSuccess(data, dbResult.Count());
            }
        }

    }
}
