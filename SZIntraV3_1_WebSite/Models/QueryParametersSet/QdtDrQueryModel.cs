using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models.QueryParametersSet
{
    public class QdtDrQueryModel
    {
        QDTEntities qdtEntities = new QDTEntities();
        public string dr_num { get; set; }
        public string production_line { get; set; }
        public string part_num { get; set; }
        public string dr_status { get; set; }
        public string job_card { get; set; }

        public DateTime? due_date_from { get; set; }
        public DateTime? due_date_to { get; set; }
        public DateTime? create_date_from { get; set; }
        public DateTime? create_date_to { get; set; }

        public int? qe_owner { get; set; }
        public int? me_owner { get; set; }
        public int? act_owner { get; set; }
        public int? dr_type { get; set; }
        public int? reason_code { get; set; }
        public int? dr_creator { get; set; }




        //public  QueryDrs()
        //{
        //    using (QDTEntities db = new QDTEntities())
        //    {
        //        var drs = (from dr in db.qdt_dr
        //                   join drType in db.qdt_com_string on dr.dr_type equals drType.id
        //                   join createBy in db.sys_user on dr.create_by equals createBy.user_id
        //                   join qeOwner in db.hr_employee on dr.dr_qe_owner equals qeOwner.employee_id
        //                   join meOwner in db.hr_employee on dr.dr_me_owner equals meOwner.employee_id
        //                   join item in db.sl_item on dr.discrepancy_item equals item.item
        //                   join code in db.pmb_plan_code on item.plan_code equals code.plan_code
        //                   join action in db.qdt_action on dr.dr_num equals action.dr_num
        //                     into temp_action
        //                   from a in temp_action.DefaultIfEmpty()
        //                   join disposition in db.qdt_disposition on dr.dr_num equals disposition.dr_num
        //                    into temp_disposition
        //                   from d in temp_disposition.DefaultIfEmpty()

        //                   select new
        //                   {
        //                       // dr_num = dr.dr_num,
        //                       dr = dr,
        //                       drType = new { qdtComString = drType },
        //                       createBy = new { user = createBy },
        //                       qeOwner = new { employee = qeOwner },
        //                       meOwner = new { employee = meOwner },
        //                       code = code,
        //                       item = item,
        //                       action = a,
        //                       disposition = d
        //                   }).ToList();

        //        if (!(dr_num == null))
        //        {
        //            drs = drs.Where(n => n.dr.dr_num == dr_num).ToList();
        //        }
        //        if (!(production_line == null))
        //        {
        //            drs = drs.Where(n => n.code.plan_code == production_line).ToList();
        //        }
        //        if (!(part_num == null))
        //        {
        //            drs = drs.Where(n => n.item.item == part_num).ToList();
        //        }
        //        if (!(dr_status == null))
        //        {
        //            drs = drs.Where(n => n.dr.status == dr_status).ToList();
        //        }
        //        if (!(job_card == null))
        //        {
        //            drs = drs.Where(n => n.dr.job == job_card).ToList();
        //        }
        //        if (due_date_from.HasValue)
        //        {
        //            drs = drs.Where(n => n.dr.due_date >= due_date_from).ToList();
        //        }
        //        if (due_date_to.HasValue)
        //        {
        //            drs = drs.Where(n => n.dr.due_date < due_date_to.Value.AddDays(1)).ToList();
        //        }
        //        if (create_date_from.HasValue)
        //        {
        //            drs = drs.Where(n => n.dr.create_date >= create_date_from).ToList();
        //        }
        //        if (create_date_to.HasValue)
        //        {
        //            drs = drs.Where(n => n.dr.create_date < create_date_to.Value.AddDays(1)).ToList();
        //        }
        //        if (qe_owner.HasValue)
        //        {
        //            drs = drs.Where(n => n.dr.dr_qe_owner == qe_owner).ToList();
        //        }
        //        if (me_owner.HasValue)
        //        {
        //            drs = drs.Where(n => n.dr.dr_me_owner == me_owner).ToList();
        //        }
        //        if (act_owner.HasValue)
        //        {
        //            drs = drs.Where(n => n.action.act_owner == act_owner).ToList();
        //        }
        //        if (dr_type.HasValue)
        //        {
        //            drs = drs.Where(n => n.dr.dr_type == dr_type).ToList();
        //        }
        //        if (reason_code.HasValue)
        //        {
        //            drs = drs.Where(n => n.disposition.reason == reason_code).ToList();
        //        }
        //        if (dr_creator.HasValue)
        //        {
        //            drs = drs.Where(n => n.dr.create_by == dr_creator).ToList();
        //        }
        //       return drs.Distinct().ToList();
        //     //   drs = drs.ToList().Distinct();
        //        //var x = (from dr in drs
        //        //         select new QdtDiscrepancyReport
        //        //         {

        //        //             dr = dr.dr,
        //        //             // drType = new QdtCommonString(new {qdtComString = dr.drType}),
        //        //             createBy = new QdtUser(new sys_user{ }),

        //        //         });
        //    }
        //}




        public List<qdt_dr> QueryDrs()
        {
            List<qdt_dr> drs = qdtEntities.qdtSearchDRsSP(dr_num,
                                                 due_date_from,
                                                 due_date_to,
                                                 create_date_from,
                                                 create_date_to,
                                                 production_line,
                                                 part_num,
                                                 qe_owner,
                                                 me_owner,
                                                 act_owner,
                                                 dr_status,
                                                 job_card,
                                                 dr_type,
                                                 reason_code,
                                                 dr_creator).ToList();

            return drs;
        }
    }
}