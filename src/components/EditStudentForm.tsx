import { useForm, useWatch } from 'react-hook-form';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Student } from '../types';

interface EditStudentFormProps {
  student: Student;
  onSubmit: (data: Student) => void;
  onCancel: () => void;
  existingPhoneNumbers: string[];
}

export function EditStudentForm({ student, onSubmit, onCancel, existingPhoneNumbers }: EditStudentFormProps) {
  const { register, handleSubmit, formState: { errors }, control } = useForm<Student>({
    defaultValues: student
  });

  const status = useWatch({ control, name: 'activityStatus' });

  const validatePhoneNumber = (value: string) => {
    if (!value.match(/^\d{12}$/)) {
      return 'Phone number must be exactly 12 digits';
    }
    if (value !== student.phoneNumber && existingPhoneNumbers.includes(value)) {
      return 'This phone number is already registered';
    }
    return true;
  };

  const onFormSubmit = (data: Student) => {
    // If status is changed to active, clear inactivity reason and date
    if (data.activityStatus === 'ACTIVE' && student.activityStatus === 'INACTIVE') {
      data.inactivityReason = undefined;
      data.inactiveOn = undefined;
    }
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            {...register('name', { required: 'Name is required' })}
            error={errors.name?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            {...register('phoneNumber', {
              required: 'Phone number is required',
              validate: validatePhoneNumber
            })}
            error={errors.phoneNumber?.message}
            className="mt-1"
            placeholder="911234567890"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Type</label>
          <select
            {...register('type', { required: 'Type is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="JOB_SEEKER">Job Seeker</option>
            <option value="PAID_INTERN">Paid Intern</option>
            <option value="UNPAID_INTERN">Unpaid Intern</option>
            <option value="STUDENT">Student</option>
            <option value="LEARNER">Learner</option>
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-500">{errors.type.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <Input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            error={errors.email?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
          <Input
            type="number"
            {...register('amountPaid', {
              required: 'Amount paid is required',
              min: { value: 0, message: 'Amount must be positive' },
            })}
            error={errors.amountPaid?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Due Amount</label>
          <Input
            type="number"
            {...register('dueAmount', {
              required: 'Due amount is required',
              min: { value: 0, message: 'Amount must be positive' },
            })}
            error={errors.dueAmount?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Discount</label>
          <Input
            type="number"
            {...register('discount', {
              required: 'Discount is required',
              min: { value: 0, message: 'Discount must be positive' },
            })}
            error={errors.discount?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Incentives Paid</label>
          <Input
            type="number"
            {...register('incentivesPaid', {
              required: 'Incentives paid is required',
              min: { value: 0, message: 'Amount must be positive' },
            })}
            error={errors.incentivesPaid?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Date of Joining</label>
          <Input
            type="date"
            {...register('dateOfJoining', { required: 'Date of joining is required' })}
            error={errors.dateOfJoining?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Inactive On</label>
          <Input
            type="date"
            {...register('inactiveOn')}
            className="mt-1"
          />
          {status === 'ACTIVE' && student.inactiveOn && (
            <p className="mt-1 text-sm text-yellow-600">
              Warning: This student is scheduled to become inactive on this date
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            {...register('activityStatus', { required: 'Status is required' })}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          {status === 'ACTIVE' && student.activityStatus === 'INACTIVE' && (
            <p className="mt-1 text-sm text-green-600">
              Reactivating will clear inactivity reason and scheduled date
            </p>
          )}
        </div>

        {status === 'INACTIVE' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Inactivity Reason</label>
            <textarea
              {...register('inactivityReason', { 
                required: status === 'INACTIVE' ? 'Reason is required when status is inactive' : false 
              })}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.inactivityReason && (
              <p className="mt-1 text-sm text-red-500">{errors.inactivityReason.message}</p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <Input
            {...register('country', { required: 'Country is required' })}
            error={errors.country?.message}
            className="mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <Input
            {...register('state', { required: 'State is required' })}
            error={errors.state?.message}
            className="mt-1"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            {...register('address', { required: 'Address is required' })}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Government ID Proof</label>
          <Input
            {...register('governmentIdProof', { required: 'Government ID proof is required' })}
            error={errors.governmentIdProof?.message}
            className="mt-1"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}