using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using ProductionManagement.Models.EntityModel;
namespace SZIntraV3_1_WebSite.Models
{
    public class SlItem
    {
        // public static SLEntities slEntities = new SLEntities();

        public sl_item item;

        public HrEmployee qe_owner { set; get; }
        public HrEmployee me_owner { get; set; }

        public SlItem(sl_item item)
        {
            this.item = item;
        }

        public static SlItem getItemByid(string item)
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    return new SlItem(db.sl_item.Single(n => n.item == item));
                }
            }
            catch
            {
                return null;
            }


        }

        public void InitialProperties()
        {
            try
            {
                qe_owner = HrEmployee.GetEmployeeById(item.qe_owner.Value);
                me_owner = HrEmployee.GetEmployeeById(item.me_owner.Value);
            }
            catch
            {

            }
        }

    }
}