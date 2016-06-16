using System;
using System.Collections.Generic;
using System.Data.Objects;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Web.Mvc;
using Common.Utility.Direct;
using Common.Utility.Extension;
using Ext.Direct.Mvc;
using ProductionManagement.Models;
using ProductionManagement.Models.EntityModel;
using ProductionManagement.Models.Scan;
using SuzhouHr.Models;
using SZIntraV3_1_WebSite.Models.EntityModel.QdtModel;
using Newtonsoft.Json.Linq;
using SZIntraV3_1_WebSite.Models.Inspection;
using SZIntraV3_1_WebSite.Models.Ll;
using SZIntraV3_1_WebSite.Models.System;
using SZIntraV3_1_WebSite.Utility;

namespace SZIntraV3_1_WebSite.Controllers.DirectProvider
{
    public class DpScanController : DirectMvcController
    {
        /// <summary>
        /// Get employee and shift info before employee starting to scan
        /// </summary>
        /// <param name="localId">5 digital Suzhou local employee number</param>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult EmployeeCheckIn(string localId)
        {

            Employee employee = new Employee(localId);
            if (employee != null && employee.CurrentFlag)
            {
                using (PmbEntities db = new PmbEntities())
                {



                    employee.IsInShiftArrangement = true;
                    employee.PunchedIn = true;
                    // var paramInBreak = new ObjectParameter("result", typeof(bool));
                    // db.pmbAnyBreakLunchPeriodSp(DateTime.Now, shift.id, paramInBreak);
                    //employee.IsInBreakLunch = (bool)paramInBreak.Value;
                    employee.IsInBreakLunch = false;

                    EmployeeScanCheckIn(employee.EmployeeId, DateTime.Now);


                }
                return DirectSuccess(employee);
            }
            else
            {
                return DirectFailure("工号不正确");
            }

        }

        [DirectInclude]
        public ActionResult EmployeeCheckOut(int employeeId)
        {
            using (PmbEntities db = new PmbEntities())
            {
                db.pmb_scan_check_in.DeleteObject(db.pmb_scan_check_in.Single(n => n.employee_id == employeeId));
                db.SaveChanges();
            }
            return DirectSuccess();
        }

        private bool EmployeeScanCheckIn(int employeeId, DateTime transactionTime)
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    if (db.pmb_scan_check_in.Any(n => n.employee_id == employeeId))
                    {
                        db.pmb_scan_check_in.DeleteObject(db.pmb_scan_check_in.Single(n => n.employee_id == employeeId));
                        db.SaveChanges();
                    }
                    db.pmb_scan_check_in.AddObject(new pmb_scan_check_in()
                    {
                        employee_id = employeeId,
                        transaction_time = transactionTime
                    });
                    db.SaveChanges();
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="machineNumber"></param>
        /// <returns>pmb_machine entity</returns>
        [DirectInclude]
        public ActionResult GetMachine(string machineNumber)
        {
            using (PmbEntities db = new PmbEntities())
            {
                machineNumber = machineNumber.Trim().ToLower();
                if (db.pmb_machine.Count(n => n.machine_number.Equals(machineNumber)) == 1)
                {
                    return DirectSuccess(db.pmb_machine.Single(n => n.machine_number.Equals(machineNumber)));
                }
                else
                {
                    return DirectFailure("机器编号不正确");
                }
            }
        }

        [DirectInclude]
        public ActionResult CheckMachineOccupied(int machineId)
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    var date = DateTime.Now.Date.AddDays(-1);
                    if (db.pmb_scan_batch.Any(n => n.machine_id == machineId && n.end_time == null && n.work_date.Value >= date) || db.pmb_scan_transaction.Any(n => n.machine_id == machineId && n.end_time == null && n.work_date.Value >= date))
                    {
                        return this.Direct(new
                        {
                            success = true,
                            occupied = true
                        });
                    }
                    else
                    {
                        return this.Direct(new
                        {
                            success = true,
                            occupied = false
                        });
                    }
                }
            }
            catch (Exception e)
            {
                return DirectFailure(e);
            }
        }

        [DirectInclude]
        public ActionResult GetJobOrder(string job, int suffix)
        {
            SZIntraV3_1_WebSite.Utility.Job jobOrder = new SZIntraV3_1_WebSite.Utility.Job(job, suffix);
            return DirectSuccess(jobOrder);
        }

        [DirectInclude]
        public ActionResult GetJobOperationNumbers(string job, int suffix)
        {
           
            using (QDTEntities db = new QDTEntities()) {
                
                List<qdtGetOpsByJobSP_Result> ops = db.qdtGetOpsByJobSP(job, suffix).ToList(); //TODO  suffix
                return DirectSuccess(ops);
            }
            
            
        }

        //[DirectInclude]
        //public ActionResult EndTransaction(int employeeId, List<pmbGetCurrentWorkByEmployeeIdSP_Result> currentJobs)
        //{ 

        //}

        /// <summary>
        /// Get employee's check in time logged in database while he logged into scan system
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns></returns>
        private DateTime? GetEmployeeCheckInTime(int employeeId)
        {
            DateTime? checkInTime = null;
            using (PmbEntities db = new PmbEntities())
            {
                if (db.pmb_scan_check_in.Any(n => n.employee_id == employeeId))
                {
                    checkInTime = db.pmb_scan_check_in.Single(n => n.employee_id == employeeId).transaction_time.Value;
                }
            }
            return checkInTime;
        }

        [DirectInclude]
        public ActionResult ScanSubmit(List<pmbGetCurrentWorkByEmployeeIdSP_Result> currentJobs, List<JObject> newJobs, bool isPunchOut, string indirectCode, string transType, int employeeId, bool punchedIn, int? machineId, int? trainerEmployeeId, int? trainingProcessId)
        {
            using (PmbEntities db = new PmbEntities())
            {
                DateTime? checkInTime = GetEmployeeCheckInTime(employeeId);
                DateTime transactionTime = new DateTime();
                //all transactions' transaction time should be same
                if (!checkInTime.HasValue)
                {
                    return DirectFailure("操作时间未登记");
                }
                else
                {
                    transactionTime = checkInTime.Value;
                }

                var shiftSchedule = GetMatchedShiftSchedule(employeeId);
                int shiftId = 0;
                var shift = new pmb_shift_schedule();
                //TODO: refine getting shift. not perfect logic to get employee's shift 
                //var paramShiftId = new ObjectParameter("shift_id", typeof(int));
                //db.pmbGetMatchedShiftSp(employeeId, paramShiftId);
                //var shiftId = (int)paramShiftId.Value;

                if (shiftSchedule != null)
                {
                    shiftId = shiftSchedule.id;
                    shift = db.pmb_shift_schedule.Single(n => n.id == shiftId);
                }
                if (!punchedIn && shiftSchedule != null)
                {
                    //TODO: change name to pmbEmployeePunchInSp
                    db.pmbEmployeePunchInSp1(shiftId);
                }
                #region ending current work
                //目前isPunchOut 肯定是false，前台没有true的选项
                if (currentJobs.Count > 0 && isPunchOut)
                {
                    DoEndCurrentWork(employeeId, currentJobs);
                }
                #endregion

                #region start new work
                //while starting to do something, it can be a batch transaction of same transaction type on same machine, or be a single inspection transaction, or an indirect one

                //direct transaction
                if (!isPunchOut)
                {
                    if (newJobs.Count > 0)
                    {
                        var transactionType = (TransactionType)Enum.Parse(typeof(TransactionType), transType, true);
                        //starting batch
                        if (newJobs.Count > 1)
                        {
                            List<pmb_scan_labor_work> laborWorks = new List<pmb_scan_labor_work>();
                            foreach (var newJob in newJobs)
                            {
                                int? operNum = newJob["oper_num"].Value<int?>();
                                int inspectionId = newJob["inspection_id"].Value<int>();
                                string job = newJob["job"].Value<string>();
                                int? suffix = newJob["suffix"].Value<int?>();
                                if (CheckIsDefaultInspectionTransaction(transactionType))
                                {
                                    //inspector has changed the operation from inspection record
                                    if (newJob["oper_num"].Value<int>() != newJob["original_oper_num"].Value<int>())
                                    {
                                        string serial = newJob["serial"].Value<string>();
                                        inspectionId = CreateSubInspection(serial, inspectionId, operNum, employeeId);
                                        StartInspection(inspectionId, employeeId);
                                    }
                                }
                                var laborWork = new pmb_scan_labor_work()
                                {
                                    inspection_id = inspectionId,
                                    job = job,
                                    suffix = suffix,
                                    oper_num = operNum,
                                    plan_time = GetStandardInspectionTime(transactionType, job, suffix, operNum)
                                };
                                laborWorks.Add(laborWork);
                            }
                            int batchId = StartBatchWork(employeeId, transactionType, laborWorks, transactionTime, machineId);
                            if (trainingProcessId != null)
                            {

                                var processBatch = new qdt_process_batch()
                                {
                                    process_id = trainingProcessId,
                                    batch_id = batchId
                                };
                                db.qdt_process_batch.AddObject(processBatch);

                                var processTrainer = new qdt_process_trainer()
                                {
                                    trainee = GetUserIdByEmployeeId(employeeId),
                                    trainer = trainerEmployeeId,
                                    process_id = trainingProcessId,
                                    batch_id = batchId,
                                    transaction_id = null

                                };
                                db.qdt_process_trainer.AddObject(processTrainer);
                                db.SaveChanges();


                            }
                        }
                        else
                        {
                            JObject newJob = newJobs.First();
                            int? operNum = newJob["oper_num"].Value<int?>();
                            int inspectionId = newJob["inspection_id"].Value<int>();
                            string job = newJob["job"].Value<string>();
                            int? suffix = newJob["suffix"].Value<int?>();
                            int? projectId = null;
                            if (newJob["project_id"].Value<string>().Length > 0)
                            {
                                projectId = Convert.ToInt32(newJob["project_id"].Value<string>());
                            }

                            if (CheckIsDefaultInspectionTransaction(transactionType))
                            {
                                if (newJob["oper_num"].Value<int>() != newJob["original_oper_num"].Value<int>())
                                {
                                    string serial = newJob["serial"].Value<string>();
                                    inspectionId = CreateSubInspection(serial, inspectionId, operNum, employeeId);
                                    StartInspection(inspectionId, employeeId);
                                }
                            }
                            CreateDirectTransaction(inspectionId, employeeId, transactionType, machineId, projectId, transactionTime, job, suffix, operNum, shiftId);
                            if (trainingProcessId != null)
                            {
                                using (QDTEntities qdt = new QDTEntities())
                                {
                                    var transaction =
                                        qdt.qdt_inspection_log.Single(n => n.inspection_id == inspectionId);

                                    var processScan = new qdt_process_scan
                                    {
                                        process_id = trainingProcessId.Value,
                                        transaction_id = transaction.transaction_id
                                    };
                                    db.qdt_process_scan.AddObject(processScan);
                                    var processTrainer = new qdt_process_trainer()
                                    {
                                        trainee = GetUserIdByEmployeeId(employeeId),
                                        trainer = trainerEmployeeId,
                                        process_id = trainingProcessId,
                                        batch_id = null,
                                        transaction_id = transaction.transaction_id

                                    };
                                    db.qdt_process_trainer.AddObject(processTrainer);
                                    db.SaveChanges();

                                }

                            }
                        }
                    }
                    else if ((TransactionType)Enum.Parse(typeof(TransactionType), transType, true) == TransactionType.Indirect)
                    {
                        if (shiftId != 0)
                        {
                            CreateIndirectTransaction(employeeId, shift.work_date.Value, shift.shift_code, transactionTime, null, indirectCode);
                        }
                    }
                }
                #endregion
                else
                {
                    try
                    {
                        db.pmbEmployeePunchOutSp(employeeId, transactionTime);
                    }
                    catch (Exception e)
                    {

                    }

                }
                return DirectSuccess(punchedIn);


            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="transactionType"></param>
        /// <returns></returns>
        private bool CheckIsDefaultInspectionTransaction(TransactionType transactionType)
        {
            var flag = false;
            switch (transactionType)
            {
                case TransactionType.Cmm:
                case TransactionType.Manual:
                case TransactionType.Online:
                case TransactionType.Fpi:
                case TransactionType.Cleaning:
                case TransactionType.Ticleaning: flag = true; break;
                default: break;
            }
            return flag;
        }


        //必须有排班才能扫
        //private bool EndBatchWork(List<LaborWork> laborWorks, DateTime transactionTime)
        //{
        //    using (QDTEntities qdtDb = new QDTEntities())
        //    using (PmbEntities db = new PmbEntities())
        //    {
        //        int batchId = laborWorks.First().BatchId;
        //        var batch = db.pmb_scan_batch.Single(n => n.id == batchId);
        //        decimal? totalPlanTime = 0,
        //               lastJobWorkTime = 0;
        //        DateTime startTime = batch.start_time.Value;
        //        batch.end_time = transactionTime;
        //        var paramTotalBreakTime = new ObjectParameter("result", typeof(decimal));

        //        int shiftId = 0;
        //        if (db.pmb_shift_schedule.Any(n => n.employee_id == batch.employee_id && n.work_date == batch.work_date && n.shift_code == batch.shift_code))
        //        {
        //            shiftId = db.pmb_shift_schedule.Single(n => n.employee_id == batch.employee_id && n.work_date == batch.work_date && n.shift_code == batch.shift_code).id;
        //        }
        //        else
        //        {
        //            throw new Exception(string.Format("员工{0}不存在{1}的班次为{2}的排班", batch.employee_id, batch.work_date.Value.ToString("yyyy-MM-dd"), batch.shift_code));
        //        }
        //        db.pmbGetAccumulatedBreakTimeSp(startTime, transactionTime, shiftId, paramTotalBreakTime);
        //        batch.total_work_time = Convert.ToDecimal((transactionTime - startTime).TotalMinutes) - Convert.ToDecimal(paramTotalBreakTime.Value);

        //        foreach (var lw in laborWorks)
        //        {
        //            var work = db.pmb_scan_labor_work.Single(n => n.id == lw.Id);
        //            work.qty_work_on = lw.QtyWorkOn;
        //            work.qty_complete = lw.QtyComplete;
        //            totalPlanTime += work.qty_work_on * work.plan_time ?? 0;
        //        }
        //        batch.total_plan_time = totalPlanTime;

        //        //the work time of last job order in this batch
        //        lastJobWorkTime = batch.total_work_time;

        //        foreach (var lw in laborWorks)
        //        {
        //            var work = db.pmb_scan_labor_work.Single(n => n.id == lw.Id);
        //            decimal? workTime = 0;

        //            if (totalPlanTime != 0)
        //            {
        //                workTime = Math.Round((batch.total_work_time * (work.plan_time * work.qty_work_on) / totalPlanTime).Value, 2);
        //            }
        //            if (!lw.Equals(laborWorks.Last()))
        //            {
        //                work.work_time = workTime;
        //                lastJobWorkTime -= workTime;
        //            }
        //            else
        //            {
        //                work.work_time = lastJobWorkTime;
        //            }

        //            var inspection = qdtDb.qdt_inspection.Single(n => n.id == lw.InspectionId);
        //            inspection.passed = lw.Passed;
        //            qdtDb.SaveChanges();

        //        }
        //        db.SaveChanges();
        //        TransferLaborWork(batchId, transactionTime);
        //    }
        //    return true;
        //}



        //不在排班时间内也可以扫结束
        private bool EndBatchWork(List<LaborWork> laborWorks, DateTime transactionTime)
        {
            using (QDTEntities qdtDb = new QDTEntities())
            using (PmbEntities db = new PmbEntities())
            {
                int batchId = laborWorks.First().BatchId;
                var batch = db.pmb_scan_batch.Single(n => n.id == batchId);
                decimal? totalPlanTime = 0,
                       lastJobWorkTime = 0;
                DateTime startTime = batch.start_time.Value;
                batch.end_time = transactionTime;
                var paramTotalBreakTime = new ObjectParameter("result", typeof(decimal));

                int shiftId = 0;
                if (db.pmb_shift_schedule.Any(n => n.employee_id == batch.employee_id && n.work_date == batch.work_date && n.shift_code == batch.shift_code))
                {
                    shiftId = db.pmb_shift_schedule.Single(n => n.employee_id == batch.employee_id && n.work_date == batch.work_date && n.shift_code == batch.shift_code).id;
                    db.pmbGetAccumulatedBreakTimeSp(startTime, transactionTime, shiftId, paramTotalBreakTime);
                    batch.total_work_time = Convert.ToDecimal((transactionTime - startTime).TotalMinutes) - Convert.ToDecimal(paramTotalBreakTime.Value);
                }
                else
                {
                    //throw new Exception(string.Format("员工{0}不存在{1}的班次为{2}的排班", batch.employee_id, batch.work_date.Value.ToString("yyyy-MM-dd"), batch.shift_code));
                    //  db.pmbGetAccumulatedBreakTimeSp(startTime, transactionTime, shiftId, paramTotalBreakTime);
                    batch.total_work_time = Convert.ToDecimal((transactionTime - startTime).TotalMinutes);// - Convert.ToDecimal(paramTotalBreakTime.Value);
                }


                foreach (var lw in laborWorks)
                {
                    var work = db.pmb_scan_labor_work.Single(n => n.id == lw.Id);
                    work.qty_work_on = lw.QtyWorkOn;
                    work.qty_complete = lw.QtyComplete;
                    totalPlanTime += work.qty_work_on * work.plan_time ?? 0;
                }
                batch.total_plan_time = totalPlanTime;

                //the work time of last job order in this batch
                lastJobWorkTime = batch.total_work_time;

                foreach (var lw in laborWorks)
                {
                    var work = db.pmb_scan_labor_work.Single(n => n.id == lw.Id);
                    decimal? workTime = 0;

                    if (totalPlanTime != 0)
                    {
                        workTime = Math.Round((batch.total_work_time * (work.plan_time * work.qty_work_on) / totalPlanTime).Value, 2);
                    }
                    if (!lw.Equals(laborWorks.Last()))
                    {
                        work.work_time = workTime;
                        lastJobWorkTime -= workTime;
                    }
                    else
                    {
                        work.work_time = lastJobWorkTime;
                    }

                    var inspection = qdtDb.qdt_inspection.Single(n => n.id == lw.InspectionId);
                    inspection.passed = lw.Passed;
                    qdtDb.SaveChanges();

                }
                db.SaveChanges();
                TransferLaborWork(batchId, transactionTime);
            }
            return true;
        }


        private void DoEndCurrentWork(int employeeId, List<pmbGetCurrentWorkByEmployeeIdSP_Result> jobsToEnd)
        {
            using (PmbEntities db = new PmbEntities())
            {
                DateTime? checkInTime = GetEmployeeCheckInTime(employeeId);
                DateTime transactionTime = new DateTime();
                //all transactions' transaction time should be same
                if (!checkInTime.HasValue)
                {
                    throw new Exception("操作时间未登记");
                }
                else
                {
                    transactionTime = checkInTime.Value;
                }
                while (jobsToEnd.Count > 0)
                {
                    pmbGetCurrentWorkByEmployeeIdSP_Result entry = jobsToEnd.First();
                    int? batchId = entry.batch_id;
                    int? id = entry.id;
                    TransactionType transactionTyp = (TransactionType)Enum.Parse(typeof(TransactionType), entry.trans_type, true);
                    if (batchId.HasValue)
                    {
                        List<LaborWork> laborWorks = new List<LaborWork>();
                        using (QDTEntities qdtDb = new QDTEntities())
                        {
                            foreach (var job in jobsToEnd.Where(n => n.batch_id == batchId))
                            {

                                if (job.next_location.HasValue)
                                {
                                    qdt_inspection currentInspection = qdtDb.qdt_inspection.Single((qdt_inspection n) => (int?)n.id == job.inspection_id);
                                    qdt_inspection nextInspection = new qdt_inspection
                                    {
                                        item = currentInspection.item,
                                        wo = currentInspection.wo,
                                        suffix = currentInspection.suffix,
                                        oper_num = currentInspection.oper_num,
                                        quantity = currentInspection.quantity,
                                        project_id = currentInspection.project_id,
                                        inspection_location_id = job.next_location,
                                        inspection_type_id = currentInspection.inspection_type_id,
                                        urgent_reason = null,
                                        urgency = null,
                                        start_time = null,
                                        end_time = null,
                                        passed = null,
                                        dr_num = null,
                                        create_date = new DateTime?(transactionTime),
                                        create_by = new int?(GetUserIdByEmployeeId(employeeId)),
                                        update_date = new DateTime?(transactionTime),
                                        update_by = new int?(GetUserIdByEmployeeId(employeeId)),
                                        remark = currentInspection.remark,
                                        priority = new int?(0),
                                        status = "unfinished",
                                        parent_id = null
                                    };
                                    qdtDb.qdt_inspection.AddObject(nextInspection);
                                    qdtDb.SaveChanges();
                                }

                                var lw = new LaborWork()
                                {
                                    Id = job.id.Value,
                                    InspectionId = job.inspection_id,
                                    BatchId = batchId.Value,
                                    QtyComplete = job.qty_complete,
                                    QtyWorkOn = job.qty_work_on,
                                    Passed = job.passed
                                };
                                laborWorks.Add(lw);
                            }
                        }
                        EndBatchWork(laborWorks, transactionTime);
                        jobsToEnd.RemoveAll(n => n.batch_id == batchId);
                    }
                    else
                    {
                        int? transactionId = jobsToEnd.First().id;
                        var transaction = db.pmb_scan_transaction.Single(n => n.id == transactionId);
                        var transactionType = (TransactionType)Enum.Parse(typeof(TransactionType), transaction.trans_type, true);
                        var job = jobsToEnd.First();
                        transaction.qty_complete = job.qty_complete;
                        transaction.end_time = transactionTime;
                        transaction.work_time = Convert.ToDecimal((transactionTime - transaction.start_time.Value).TotalMinutes);
                        transaction.update_by = GetUserIdByEmployeeId(employeeId);
                        transaction.update_date = transactionTime;

                        db.SaveChanges();

                        if (transactionType != TransactionType.Indirect)
                        {
                            using (QDTEntities qdtDb = new QDTEntities())
                            {

                                var inspectionId = qdtDb.qdt_inspection_log.Single(n => n.transaction_id == transactionId).inspection_id;
                                if (jobsToEnd.First().next_location.HasValue)
                                {
                                    qdt_inspection currentInspection = qdtDb.qdt_inspection.Single((qdt_inspection n) => n.id == inspectionId);
                                    qdt_inspection nextInspection = new qdt_inspection
                                    {
                                        item = currentInspection.item,
                                        wo = currentInspection.wo,
                                        suffix = currentInspection.suffix,
                                        oper_num = currentInspection.oper_num,
                                        quantity = currentInspection.quantity,
                                        project_id = currentInspection.project_id,
                                        inspection_location_id = jobsToEnd.First<pmbGetCurrentWorkByEmployeeIdSP_Result>().next_location,
                                        inspection_type_id = currentInspection.inspection_type_id,
                                        urgent_reason = null,
                                        urgency = null,
                                        start_time = null,
                                        end_time = null,
                                        passed = null,
                                        dr_num = null,
                                        create_date = new DateTime?(transactionTime),
                                        create_by = new int?(GetUserIdByEmployeeId(employeeId)),
                                        update_date = new DateTime?(transactionTime),
                                        update_by = new int?(GetUserIdByEmployeeId(employeeId)),
                                        remark = currentInspection.remark,
                                        priority = new int?(0),
                                        status = "unfinished",
                                        parent_id = null
                                    };
                                    qdtDb.qdt_inspection.AddObject(nextInspection);
                                    qdtDb.SaveChanges();
                                }

                                var inspection = qdtDb.qdt_inspection.Single(n => n.id == inspectionId);
                                inspection.update_date = transactionTime;
                                inspection.update_by = GetUserIdByEmployeeId(employeeId);
                                inspection.passed = job.passed;
                                if (inspection.quantity == transaction.qty_complete)
                                {
                                    inspection.end_time = transactionTime;
                                    inspection.status = "finished";
                                }
                                qdtDb.SaveChanges();
                            }
                        }
                        jobsToEnd.Remove(entry);
                    }
                }
            }
        }

        [DirectInclude]
        public ActionResult EndCurrentWork(int employeeId, List<pmbGetCurrentWorkByEmployeeIdSP_Result> jobsToEnd)
        {
            DoEndCurrentWork(employeeId, jobsToEnd);
            return DirectSuccess();
        }

        private void TransferLaborWork(int batchId, DateTime transactionTime)
        {
            using (QDTEntities qdtDb = new QDTEntities())
            using (PmbEntities db = new PmbEntities())
            {
                var batch = db.pmb_scan_batch.Single(n => n.id == batchId);
                int updateBy = GetUserIdByEmployeeId(batch.employee_id.Value);
                string transType = batch.trans_type,
                    shiftCode = batch.shift_code;
                int? employeeId = batch.employee_id,
                    machineId = batch.machine_id,
                    projectId = batch.project_id;
                DateTime? workDate = batch.work_date,
                    batchStart = batch.start_time,
                    batchEnd = batch.end_time;
                var breakActivities = db.pmbGetShiftBreakDetailSp(shiftCode, workDate).Where(n => n.start_time > batchStart && n.start_time < batchEnd || n.end_time > batchStart && n.end_time < batchEnd).OrderBy(n => n.start_time).ToList();
                DateTime? startTime = batchStart,
                    endTime = new DateTime();
                var laborWorks = db.pmb_scan_labor_work.Where(n => n.batch_id == batchId).OrderBy(n => n.id).ToList();
                foreach (var work in laborWorks)
                {
                    StartInspection(work.inspection_id.Value, startTime.Value, updateBy);
                    var inspectionId = work.inspection_id;
                    var remainingWorkTime = work.work_time;
                    endTime = startTime.Value.AddMinutes(Convert.ToDouble(remainingWorkTime));
                    var loggedWorkFlag = false;
                    while (remainingWorkTime > 0 || !loggedWorkFlag)
                    {
                        if (!loggedWorkFlag)
                        {
                            loggedWorkFlag = true;
                        }
                        if (breakActivities.Any(n => endTime > n.start_time && endTime < n.end_time))
                        {
                            var bl = breakActivities.Where(n => endTime > n.start_time && endTime < n.end_time).OrderBy(n => n.start_time).First();
                            endTime = bl.start_time.Value;
                            var subWorkTime = Convert.ToDecimal(Math.Round((endTime.Value - startTime.Value).TotalMinutes, 2));
                            var subWork = new pmb_scan_transaction()
                            {
                                employee_id = employeeId,
                                trans_type = transType,
                                machine_id = machineId,
                                project_id = projectId,
                                work_date = workDate,
                                work_time = subWorkTime,
                                job = work.job,
                                suffix = work.suffix,
                                oper_num = work.oper_num,
                                qty_complete = 0,
                                shift_code = shiftCode,
                                start_time = startTime,
                                end_time = endTime,
                                update_by = updateBy,
                                update_date = transactionTime
                            };
                            db.pmb_scan_transaction.AddObject(subWork);
                            db.SaveChanges();
                            qdtDb.qdt_inspection_log.AddObject(new qdt_inspection_log()
                            {
                                inspection_id = inspectionId.Value,
                                transaction_id = subWork.id
                            });
                            qdtDb.SaveChanges();

                            startTime = bl.start_time;
                            endTime = bl.end_time;

                            if (!db.pmb_scan_transaction.Any(n => n.employee_id == employeeId && n.start_time == startTime))
                            {
                                db.pmb_scan_transaction.AddObject(new pmb_scan_transaction()
                                 {
                                     employee_id = employeeId,
                                     trans_type = TransactionType.Indirect.ToString().ToLower(),
                                     work_date = workDate,
                                     work_time = Convert.ToDecimal((endTime.Value - startTime.Value).TotalMinutes),
                                     shift_code = shiftCode,
                                     start_time = startTime,
                                     end_time = endTime,
                                     indirect_code = bl.indirect_code,
                                     update_by = updateBy,
                                     update_date = transactionTime
                                 });
                            }
                            remainingWorkTime -= subWorkTime;

                            if (remainingWorkTime == 0)
                            {
                                var inspection = qdtDb.qdt_inspection.Single(n => n.id == inspectionId);
                                if (work.qty_complete == inspection.quantity)
                                {
                                    inspection.end_time = endTime;
                                    inspection.status = "finished";
                                }
                                inspection.update_date = transactionTime;
                                inspection.update_by = updateBy;
                            }
                            else
                            {
                                startTime = bl.end_time;
                                endTime = startTime.Value.AddMinutes(Convert.ToDouble(remainingWorkTime));
                            }
                        }
                        else
                        {
                            var subWork = new pmb_scan_transaction()
                            {
                                employee_id = employeeId,
                                trans_type = transType,
                                machine_id = machineId,
                                project_id = projectId,
                                work_date = workDate,
                                work_time = remainingWorkTime,
                                job = work.job,
                                suffix = work.suffix,
                                oper_num = work.oper_num,
                                qty_complete = work.qty_complete,
                                shift_code = shiftCode,
                                start_time = startTime,
                                end_time = endTime,
                                update_by = updateBy,
                                update_date = transactionTime
                            };
                            db.pmb_scan_transaction.AddObject(subWork);
                            db.SaveChanges();
                            startTime = endTime;
                            qdtDb.qdt_inspection_log.AddObject(new qdt_inspection_log()
                            {
                                inspection_id = inspectionId.Value,
                                transaction_id = subWork.id
                            });
                            remainingWorkTime = 0;
                            var inspection = qdtDb.qdt_inspection.Single(n => n.id == inspectionId);
                            inspection.end_time = endTime;
                            inspection.status = "finished";
                            inspection.update_date = transactionTime;
                            inspection.update_by = updateBy;
                            qdtDb.SaveChanges();
                        }
                    }

                }
            }
        }

        private bool CreateIndirectTransaction(int employeeId, DateTime workDate, string shiftCode, DateTime startTime, DateTime? endTime, string indirectCode)
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    int userId = GetUserIdByEmployeeId(employeeId);
                    db.pmbCreateIndirectTransactionSp(employeeId, workDate, shiftCode, startTime, endTime, indirectCode, userId);
                    return true;
                }
            }
            catch
            {
                return false;
            }
        }

        private bool CreateDirectTransaction(int inspectionId, int employeeId, TransactionType transactionType, int? machineId, int? projectId, DateTime startTime, string job, int? suffix, int? operNum, int shiftId)
        {
            try
            {
                using (PmbEntities db = new PmbEntities())
                {
                    int userId = GetUserIdByEmployeeId(employeeId);
                    db.pmbStartTransactionSp(inspectionId, transactionType.ToString().ToLower(), shiftId, startTime, employeeId, machineId, projectId, job, suffix, operNum, userId);
                    return true;
                }
            }
            catch
            {
                throw;
            }
        }


        /// <summary>
        /// Return pmb_shift_schedule entity of matched shift schedule. Null if not matched.
        /// </summary>
        /// <param name="employeeId"></param>
        /// <returns></returns>
        private pmb_shift_schedule GetMatchedShiftSchedule(int employeeId)
        {
            using (PmbEntities db = new PmbEntities())
            {
                ObjectParameter paramShiftId = new ObjectParameter("shift_id", typeof(int));
                db.pmbGetMatchedShiftSp(employeeId, paramShiftId);
                int shiftId = (int)paramShiftId.Value;
                if (shiftId == 0)
                {
                    return null;
                }
                else
                {
                    return db.pmb_shift_schedule.Single(n => n.id == shiftId);
                }
            }
        }

        private void StartInspection(int inspectionId, DateTime startTime, int updateBy)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var inspection = db.qdt_inspection.Single(n => n.id == inspectionId);
                inspection.start_time = startTime;
                inspection.status = "started";
                inspection.update_by = updateBy;
                inspection.update_date = startTime;
                db.SaveChanges();
            }
        }

        private int StartBatchWork(int employeeId, TransactionType transactionType, List<pmb_scan_labor_work> laborWorks, DateTime startTime, int? machineId)
        {
            using (PmbEntities db = new PmbEntities())
            {
                int batchId;

                var shift = GetMatchedShiftSchedule(employeeId);
                var batch = new pmb_scan_batch()
                {
                    employee_id = employeeId,
                    trans_type = transactionType.ToString().ToLower(),
                    work_date = shift == null ? null : shift.work_date,
                    shift_code = shift == null ? null : shift.shift_code,
                    start_time = startTime,
                    machine_id = machineId
                };
                db.pmb_scan_batch.AddObject(batch);
                db.SaveChanges();

                batchId = batch.id;
                ////pseudo code
                //laborWorks = new List<pmb_scan_labor_work>();
                //var rdm = new Random();
                //for (int i = 0; i < 6; i++)
                //{
                //    int foo = rdm.Next(100);
                //    string job = "SZ000000" + foo.ToString();
                //    int suffix = 0;
                //    int operNum = 0;
                //    decimal planTime = GetStandardInspectionTime(transType, job, suffix, operNum);
                //    laborWorks.Add(new pmb_scan_labor_work
                //    {
                //        batch_id = batchId,
                //        job = job,
                //        suffix = suffix,
                //        oper_num = operNum,
                //        plan_time = planTime
                //    });
                //}
                foreach (var laborWork in laborWorks)
                {
                    laborWork.batch_id = batchId;
                    db.pmb_scan_labor_work.AddObject(laborWork);
                    StartInspection(laborWork.inspection_id.Value, startTime, GetUserIdByEmployeeId(employeeId));
                }
                db.SaveChanges();
                return batchId;
            }

        }


        private decimal GetStandardInspectionTime(TransactionType transactionType, string job, int? suffix, int? operNum)
        {
            try
            {
                using (QDTEntities qdt = new QDTEntities())
                using (PmbEntities db = new PmbEntities())
                {
                    decimal? planTime = 0;
                    if (qdt.qdt_inspection.Any(n => n.wo == job && n.project_id != null))
                    {
                        var customJob = qdt.qdt_inspection.Single(n => n.wo == job);
                        planTime = db.pmb_custom_project.Single(n => n.project_id == customJob.project_id).plan_time;
                    }
                    else if (suffix.HasValue && operNum.HasValue)
                    {
                        string item = new SZIntraV3_1_WebSite.Utility.Job(job, suffix.Value).item;
                        
                        var operation = new sl_operation();
                        if (db.sl_operation.Any(n => n.item == item && n.oper_num == operNum))
                        {
                            operation = db.sl_operation.Single(n => n.item == item && n.oper_num == operNum);
                        }
                        else
                        {
                            throw new Exception(string.Format("Operation {0} not found for item {1}", operNum, item));
                        }
                        switch (transactionType)
                        {
                            case TransactionType.Cmm: planTime = operation.cmm_time.Value; break;
                            case TransactionType.Manual: planTime = operation.manual_time.Value; break;
                            case TransactionType.Online: planTime = operation.online_time.Value; break;
                            default: break;
                        }
                    }
                    return planTime.Value;
                }
            }
            catch
            {
                throw;
            }

        }

        /// <summary>
        /// Return top 50 latest scan records
        /// </summary>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult GetScanHistory()
        {
            using (PmbEntities db = new PmbEntities())
            {
                return DirectSuccess(db.pmbScanTransactionView.OrderByDescending(n => n.start_time).Take(50).ToList());
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [DirectInclude]
        public ActionResult GetMyCurrentWork(int employee_id)
        {
            using (PmbEntities db = new PmbEntities())
            {
                var result = db.pmbGetCurrentWorkByEmployeeIdSP(employee_id).ToList();
                return DirectSuccess(result);
            }
        }

        [DirectInclude]
        public ActionResult GetIndirectCode()
        {
            using (PmbEntities db = new PmbEntities())
            {
                var indirectCodes = db.pmb_indirect_code.Where(n => !n.indirect_code.Equals("break") && !n.indirect_code.Equals("lunch")).ToList();
                return DirectSuccess(indirectCodes);
            }
        }


        [DirectInclude]
        public ActionResult GetInProcessOperationInformation(int employeeId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var result = db.qdtGetInProcessOperationInformationSP(employeeId).ToList();
                return DirectSuccess(result);
            }
        }

        [DirectInclude]
        public ActionResult GetCurrentProcess(int employeeId, string skillCode)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var result = db.qdtGetInProcessOperationInformationSP(employeeId).Where(n => n.skill_code.Equals(skillCode)).ToList();
                return DirectSuccess(result);
            }
        }


        [DirectInclude]
        public ActionResult GetCurrentProcessApprover(int employeeId, string skillCode)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var result = db.qdtGetInProcessOperationInformationSP(employeeId).Single(n => n.skill_code.Equals(skillCode));
                var process = db.qdt_workflow_process.Single(n => n.id == result.process_id);
                var approverIds =
                    db.qdt_workflow_approver.Where(n => n.request_id == process.request_id && n.step == process.step).ToList();

                var approvers = (from a in approverIds
                                 join su in db.sys_user on a.approver_id equals su.user_id
                                 select new
                             {
                                 approver_id = a.approver_id,
                                 approver_name = su.name_cn
                             }).ToList();
                return DirectSuccess(approvers);
            }
        }

        [DirectInclude]
        public ActionResult GetScanTransactions(JObject o)
        {
            var searchConditions = o["search_conditions"];
            int employeeId = searchConditions["employee_id"].Value<int>();
            int skillCodeId = searchConditions["skill_code"].Value<int>();

            using (PmbEntities db = new PmbEntities())
            using (QDTEntities qdt = new QDTEntities())
            {
                if (qdt.qdt_tq_certification.Any(n => n.employee_id == employeeId && n.certification_item_id == skillCodeId))
                {
                    var requestId =
                   qdt.qdt_tq_certification.Single(n => n.employee_id == employeeId && n.certification_item_id == skillCodeId).request_id;
                    List<int> processes = qdt.qdt_workflow_process.Where(n => n.request_id == requestId).Select(n => n.id).ToList();
                    string transactionType = TransactionType.Process.ToLowerString();


                    var result = (from r in db.pmb_scan_transaction
                                  join qps in db.qdt_process_scan on r.id equals qps.transaction_id
                                  where processes.Contains(qps.process_id) && r.employee_id == employeeId && r.trans_type.Equals(transactionType)
                                  select r).ToList();

                    return DirectSuccess(result, result.Count());
                }
                else
                {
                    return DirectFailure("");
                }

            }
        }


        private int GetUserIdByEmployeeId(int employeeId)
        {
            Employee employee = new Employee(employeeId);
            using (QDTEntities db = new QDTEntities())
            {
                if (db.sys_user.Count(n => n.sso == employee.Sso) != 1)
                {
                    throw new Exception(string.Format("SSO not correct for employee {0}", employeeId));
                }
                else
                {
                    return db.sys_user.Single(n => n.sso == employee.Sso).user_id;
                }
            }
        }


        private int CreateInspection(string serial, int? operNum, int? quantity, int? inspectionLocationId, int? inspectionTypeId, int createBy, string remark, int parentId, bool updatePriority)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var job = db.QDT_Job.Single(n => n.Uf_Sno.Equals(serial.Trim()) && !n.job.StartsWith("MR") && !n.job.StartsWith("MCR"));
                string wo = job.job;
                int suffix = job.suffix;
                string item = job.item;
                var inspection = new qdt_inspection
                {
                    item = item,
                    wo = wo,
                    suffix = suffix,
                    oper_num = operNum,
                    quantity = quantity,
                    inspection_location_id = inspectionLocationId,
                    inspection_type_id = inspectionTypeId,
                    create_date = DateTime.Now,
                    create_by = createBy,
                    update_date = DateTime.Now,
                    update_by = createBy,
                    remark = remark,
                    status = "unfinished",
                    priority = 0,
                    parent_id = parentId
                };
                db.qdt_inspection.AddObject(inspection);

                db.SaveChanges();
                if (updatePriority)
                {
                    InspectionRecord.UpdateInspectionPriority();
                }
                return inspection.id;
            }
        }

        private int CreateSubInspection(string serial, int inspectionId, int? operNum, int employeeId)
        {
            using (QDTEntities db = new QDTEntities())
            {
                var parentInspection = db.qdt_inspection.Single(n => n.id == inspectionId);
                var userId = VmNativeUser.GetUserIdByEmployeeId(employeeId);
                return CreateInspection(
                    serial,
                    operNum,
                    parentInspection.quantity,
                    parentInspection.inspection_location_id,
                    parentInspection.inspection_type_id,
                    userId,
                    parentInspection.remark,
                    parentInspection.id,
                    true);
            }
        }

        private void StartInspection(int inspectionId, int? updateBy)
        {
            using (PmbEntities db = new PmbEntities())
            using (QDTEntities qdtdb = new QDTEntities())
            {
                var transactionTime = db.pmb_scan_check_in.Single(n => n.employee_id == updateBy).transaction_time;
                var parentInspection = qdtdb.qdt_inspection.Single(n => n.id == inspectionId);
                parentInspection.start_time = transactionTime;
                parentInspection.update_by = updateBy;
                parentInspection.update_date = transactionTime;
                parentInspection.status = "started";
                qdtdb.SaveChanges();
            }
        }

    }
}