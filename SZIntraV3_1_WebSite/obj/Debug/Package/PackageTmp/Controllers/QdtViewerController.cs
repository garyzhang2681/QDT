using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using SZIntraV3_1_WebSite.Models;

namespace SZIntraV3_1_WebSite.Controllers
{
    public class QdtViewerController : Controller
    {
        //
        // GET: /QdtViewe/

        public ActionResult DrInfomation(string dr_num)
        {
            QdtDiscrepancyReport model = new QdtDiscrepancyReport();
            using (QDTEntities db = new QDTEntities())
            {
                var dr = db.qdt_dr.Where(n => n.dr_num == dr_num).ToList();
                if (dr.Count > 0)
                {
                    model = new QdtDiscrepancyReport(dr.First());
                }
                else {
                    ViewBag.ErrorMessage = HttpUtility.HtmlEncode("Discrepancy report not exists for number: " + dr_num);
                   
                    
                }

            }
            return View(model);
        }

        public ActionResult Index()
        {
            return View();
        }
    }
}
