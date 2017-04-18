using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Ext.Direct.Mvc;
using Newtonsoft.Json.Linq;
using System.Linq.Dynamic;

namespace SZIntraV3_1_WebSite.Utility
{
    public class DirectHelper : Controller
    {

        public ActionResult DirectEmpty()
        {
            return this.Direct(new
            {
                data = new List<object>(),
                total = 0
            });
        }

        public ActionResult DirectSuccess()
        {
            return this.Direct(new
            {
                success = true
            });
        }

        public ActionResult DirectSuccess(string message)
        {
            return this.Direct(new
            {
                success = true,
                data = message
            });
        }

        public DirectResult DirectSuccess(IEnumerable<object> data)
        {
            return this.Direct(new
            {
                success = true,
                data = data,
                total = data.Count()
            });
        }

        public ActionResult DirectFailure()
        {
            return this.Direct(new
            {
                success = false
            });
        }

        public ActionResult DirectTimeout()
        {
            return this.Direct(new
            {
                success=false,
                timeout= true
            });
        }

        public ActionResult DirectTimeout(string message)
        {
            return this.Direct(new
            {
                success = false,
                timeout = true,
                erroeMessage = message
            });
        }


        public ActionResult DirectFailure(string message)
        {
            return this.Direct(new
            {
                success = false,
                errorMessage = message
            });
        }

        public ActionResult DirectFailure(Exception e)
        {
            return this.Direct(new
            {
                success = false,
                errorMessage = e.Message
            });
        }

        //public ActionResult DirectCorrect(Controller controller, List<object> list, int count)
        public ActionResult DirectCorrect(IQueryable gridData, int totalCount)
        {
            return this.Direct(new
            {
                data = gridData,
                total = totalCount
            });
        }

        public ActionResult DirectCorrect(IQueryable gridData)
        {
            return this.Direct(new
            {
                data = gridData
            });
        }


        #region Paged Data
        public IQueryable<T> PagedData<T>(JObject o, IQueryable<T> dbResult)
        {
            PagingParams pp = new PagingParams(o, dbResult);
            return (IQueryable<T>)DynamicQueryable.OrderBy(dbResult, pp.Sort + " " + pp.Dir).Skip(pp.Start).Take(pp.Limit);
        }
        #endregion

        #region Paging Params
        public class PagingParams
        {
            public int Start { get; set; }
            public int Page { get; set; }
            public int Limit { get; set; }
            public string Sort { get; set; }
            public string Dir { get; set; }

            public PagingParams(JObject j, IQueryable r)
            {
                Start = (int)j["start"];
                Page = (int)j["page"];
                Limit = (int)j["limit"]; ;
                Sort = j["sort"].Value<string>();
                Dir = j["dir"].Value<string>();

                if (Start < 0)
                {
                    Start = 0;
                }
                else if (Start == 0 && Limit <= r.Count())
                {
                    Limit = Limit;
                }
                else if (Start == 0 && Limit > r.Count())
                {
                    Limit = r.Count();
                }
                else if (Start != 0 && (Start + Limit) >= r.Count())
                {
                    Limit = r.Count() - Start;
                }
            }

        }
        #endregion

    }



}