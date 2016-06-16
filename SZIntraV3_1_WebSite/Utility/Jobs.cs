using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Utility
{
    public class Job
    {
        public string job { get; set; }
        public int suffix { get; set; }
        public string status { get; set; }
        public string item { get; set; }
        public int qty_released { get; set; }

        public Job(string job, int suffix)
        {
            using (QDTEntities db = new QDTEntities())
            {
                
                if (db.QDT_Job.Any(n => n.job == job && n.suffix == suffix))
                {
                    var jobOrder = db.QDT_Job.Single(n => n.job == job && n.suffix == suffix);

                    this.job = jobOrder.job;
                    this.suffix = jobOrder.suffix;
                    this.status = jobOrder.stat;
                    this.item = jobOrder.item;
                    this.qty_released = Convert.ToInt32(jobOrder.qty_released);
                }
                else
                {
                    throw new System.Exception("Job not exists.");
                }
            }
        }

        //public List<JobOperation> GetJobOperations()
        //{
        //    using (PmbEntities db = new PmbEntities())
        //    {

        //    }
        //    return null;
        //}

        //public List<object> GetJobOperationNumbers()
        //{
        //    using (Pmb83Entities db = new Pmb83Entities())
        //    {
        //        return db.jobroutes.Where(n => n.job == this.job && n.suffix == this.suffix).Select(n => new { oper_num = n.oper_num }).ToList<object>();
        //    }
        //}

    }
}