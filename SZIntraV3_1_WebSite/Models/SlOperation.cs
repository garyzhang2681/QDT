using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ProductionManagement.Models.EntityModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class SlOperation
    {
        public sl_operation operation;

        public HrEmployee qe_owner { get; set; }
        public HrEmployee me_owner { get; set; }

        public SlOperation(sl_operation operation)
        {
            this.operation = operation;
        }

        public static SlOperation getOperationById(string item, int oper_num)
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    return new SlOperation(db.sl_operation.Single(n => n.item == item && n.oper_num == oper_num));
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
                qe_owner = HrEmployee.GetEmployeeById(operation.qe_owner.Value);
                me_owner = HrEmployee.GetEmployeeById(operation.me_owner.Value);
            }
            catch
            {

            }
        }
    }
}