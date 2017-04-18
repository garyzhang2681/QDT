using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SuzhouHr.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.SystemAdminModel;

namespace SZIntraV3_1_WebSite.Models.System
{
    public class VmNativeUser
    {
        public int user_id { get; set; }
        public int employee_id { get; set; }
        public string local_id { get; set; }
        public string sso { get; set; }
        public string name_cn { get; set; }
        public string name_en { get; set; }
        public string email { get; set; }


        public static List<sysGetNativeUsersSp_Result> GetAll()
        {
            using (SystemAdminEntities db = new SystemAdminEntities())
            {
                var result = db.sysGetNativeUsersSp().ToList();
                return result;
            }
        }
        
        public static sysGetNativeUsersSp_Result GetNativeUserByUserId(int userId)
        {
            List<sysGetNativeUsersSp_Result> allUsers = GetAll();
            return allUsers.Single(n => n.user_id == userId);

        }

        public static int GetEmployeeIdByUserId(int userId)
        {
            List<sysGetNativeUsersSp_Result> allUsers = GetAll();
            return allUsers.Single(n => n.user_id == userId).employee_id;

        }



        public static sysGetNativeUsersSp_Result GetNativeUserByEmployeeId(int employeeId)
        {
            List<sysGetNativeUsersSp_Result> allUsers = GetAll();
            return allUsers.Single(n => n.employee_id == employeeId);

        }

        public static int GetUserIdByEmployeeId(int employeeId)
        {
            List<sysGetNativeUsersSp_Result> allUsers = GetAll();
            return allUsers.Single(n => n.employee_id == employeeId).user_id;

        }
    }

}