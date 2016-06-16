using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SuzhouHr.Models.EntityModel;

namespace SZIntraV3_1_WebSite.Models
{
    public class HrEmployee
    {

        public hr_employee employee;

        public HrEmployee(hr_employee employee)
        {
            this.employee = employee;
            //this.employee_id = employee.employee_id;
            //this.name_cn = employee.name_cn;
            //this.name_en = employee.name_en;
            //this.sso = employee.sso;
            //this.email = employee.email;
        }

        public static HrEmployee GetEmployeeById(int id)
        {
            var db = new SuzhouHrEntities();
            hr_employee employee = null;

            if (db.hr_employee.Where(n => n.employee_id == id).Count() > 0)
            {
                employee = db.hr_employee.Single(n => n.employee_id == id);
            }
            return new HrEmployee(employee);
        }

        public static HrEmployee GetEmployeeByLocalId(string localId)
        {
            using (SuzhouHrEntities hr = new SuzhouHrEntities())
            {
                try
                {
                    return new HrEmployee(hr.hr_employee.Single(n => n.local_id == localId));
                }
                catch
                {
                    return null;
                }
            }
        }

    }
}