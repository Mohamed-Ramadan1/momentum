/* 
1. QueueFactory → Creates hard-coded queues
2. ProcessorRegistry → Registers all job processors (via DI scanning or hard-coding)
3. WorkerManager → Creates workers WITH pre-registered processors
4. JobManager → Starts managing job lifecycle (including any existing jobs)



// Worker processors 
1. DI Container resolves WorkerManager
2. Injects all processor classes into WorkerManager
3. WorkerManager has processors ready before any worker creation
4. Workers created with pre-available processors

*/
