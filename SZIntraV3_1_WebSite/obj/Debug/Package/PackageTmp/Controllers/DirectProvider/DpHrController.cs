using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using SuzhouHr.Models;
using SuzhouHr.Models.EntityModel;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpHrController : QdtBaseController
    {

        [DirectInclude]
        public ActionResult GetWorkingGroups()
        {
            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                return DirectSuccess(db.hr_working_group.ToList());
            }
        }


        private List<hr_employee> EmployeesInWorkingGroup(int[] workingGroups)
        {
            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                List<hr_employee> employees = (from hwg in db.hr_working_group
                                               join hwge in db.hr_working_group_employee on hwg.working_group_id equals hwge.working_group_id into
                                                   ges
                                               from ge in ges.DefaultIfEmpty()
                                               join he in db.hr_employee on ge.employee_id equals he.employee_id
                                               where workingGroups.Contains(hwg.working_group_id)
                                               select he).Distinct().ToList();
                return employees;
            }
        }

        [DirectInclude]
        public ActionResult GetEmployeesInWorkingGroups(int[] workingGroups)
        {
            return this.DirectSuccess(EmployeesInWorkingGroup(workingGroups));
        }

        [DirectInclude]
        public ActionResult GetEmployeesNotInWorkingGroups(int[] workingGroups)
        {
            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                var allEmployees = db.hr_employee.ToList();
                var employeesInWorkingGroups = EmployeesInWorkingGroup(workingGroups);
                var employeeIdsInWorkingGroups = (from eiwg in employeesInWorkingGroups
                                                  select eiwg.employee_id).ToList();
                var employeesNotInWorkingGroups =
                    allEmployees.Where(n => !employeeIdsInWorkingGroups.Contains(n.employee_id));

                return this.DirectSuccess(employeesNotInWorkingGroups);
            }
        }


        [DirectInclude]
        public ActionResult CreateGroup(string workingGroup)
        {
            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                if (db.hr_working_group.Any(n => n.working_group.ToLower().Equals(workingGroup.ToLower())))
                {
                    return DirectFailure("分组已经存在");
                }
                else
                {
                    db.hr_working_group.AddObject(new hr_working_group()
                    {
                        working_group = workingGroup,
                        parent_group = 0
                    });
                    db.SaveChanges();
                    return DirectSuccess();
                }
            }
        }

        [DirectInclude]
        public ActionResult UpdateGroup(hr_working_group entry)
        {

            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                if (
                    db.hr_working_group.Any(
                        n => n.working_group.ToLower().Equals(entry.working_group.ToLower()) && n.working_group_id != entry.working_group_id))
                {
                    return DirectFailure("类别已经存在");
                }
                else
                {
                    db.hr_working_group.Single(n => n.working_group_id == entry.working_group_id).working_group = entry.working_group.Trim();
                    db.SaveChanges();
                    return DirectSuccess();
                }
            }
        }

        [DirectInclude]
        public ActionResult DeleteGroup(int workingGroupId)
        {
            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                if (db.hr_working_group.Any(n => n.working_group_id == workingGroupId))
                {
                    db.hr_working_group.DeleteObject(db.hr_working_group.Single(n => n.working_group_id == workingGroupId));
                    db.SaveChanges();
                }
                return DirectSuccess();
            }
        }

        [DirectInclude]
        public ActionResult DeleteGroupMember(int workingGroupId, List<hr_employee> employees)
        {
            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                foreach (hr_employee employee in employees)
                {
                    if (db.hr_working_group_employee.Any(n => n.working_group_id == workingGroupId && n.employee_id == employee.employee_id))
                    {
                        db.hr_working_group_employee.DeleteObject(db.hr_working_group_employee.Single(n => n.working_group_id == workingGroupId && n.employee_id == employee.employee_id));
                        db.SaveChanges();
                    }
                }
                return this.DirectSuccess();
            }
        }


        [DirectInclude]
        public ActionResult AddGroupMember(int workingGroupId, List<hr_employee> employees)
        {
            using (SuzhouHrEntities db = new SuzhouHrEntities())
            {
                foreach (hr_employee employee in employees)
                {
                    if (!db.hr_working_group_employee.Any(n => n.working_group_id == workingGroupId && n.employee_id == employee.employee_id))
                    {
                        db.hr_working_group_employee.AddObject(new hr_working_group_employee()
                        {
                            working_group_id = workingGroupId,
                            employee_id = employee.employee_id
                        });
                        db.SaveChanges();
                    }
                }
                return this.DirectSuccess();
            }
        }


    }
}
