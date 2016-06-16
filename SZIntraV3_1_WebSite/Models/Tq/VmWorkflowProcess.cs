using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;

namespace SZIntraV3_1_WebSite.Models.Tq
{
    public class VmWorkflowProcess
    {
        public int id { get; set; }
        public int request_id { get; set; }
        public int step { get; set; }
        public string name { get; set; }
        public string status { get; set; }
        public DateTime? start_time { get; set; }
        public DateTime? end_time { get; set; }
        public string approvers { get; set; }


        public VmWorkflowProcess(qdt_workflow_process process)
        {
            Dictionary<int, List<int>> approverList = GetApprovers(process.request_id);
            end_time = process.end_time;
            id = process.id;
            name = process.name;
            request_id = process.request_id;
            start_time = process.start_time;
            status = process.status;
            step = process.step;
            approvers = string.Join(",", approverList[process.step]);
        }

        private static Dictionary<int, List<int>> GetApprovers(int requestId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var approvers = db.qdt_workflow_approver.Where(n => n.request_id == requestId).GroupBy(n => n.step).ToDictionary(g => g.Key, g => g.Select(n => n.approver_id).ToList());
                return approvers;
            }
        }
    }
}