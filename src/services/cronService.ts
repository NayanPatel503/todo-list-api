import cron from 'node-cron';
import { Todo } from '../models/Todo';

export const setupCronJob = () => {
  console.log('Setting up CRON job');
  // Run at midnight every day
  cron.schedule('0 0 * * *', async () => {
    try {
      console.log('Running CRON job');
      const now = new Date();
      
      // Find all uncompleted todos with due dates before now
      const expiredTodos = await Todo.find({
        completed: false,
        dueDate: { $lt: now },
      });

      // Update all expired todos to completed
      if (expiredTodos.length > 0) {
        await Todo.updateMany(
          {
            _id: { $in: expiredTodos.map((todo) => todo._id) },
          },
          {
            $set: { completed: true },
          }
        );

        console.log(`Updated ${expiredTodos.length} expired todos`);
      }
    } catch (error) {
      console.error('Error in CRON job:', error);
    }
  });
}; 