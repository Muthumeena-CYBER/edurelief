import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-primary text-slate-900 dark:text-white px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {user?.picture && (
            <img
              src={user.picture}
              alt={user.name || 'User avatar'}
              className="w-16 h-16 rounded-full border border-slate-200 dark:border-slate-700"
            />
          )}
          <div>
            <p className="text-sm uppercase tracking-[0.14em] text-slate-500 font-black">Profile</p>
            <h1 className="text-2xl font-black">{user?.name || 'User'}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">{user?.email || 'No email available'}</p>
          </div>
        </div>
        <div className="text-sm text-slate-700 dark:text-slate-300">
          <pre className="bg-slate-100 dark:bg-slate-800 rounded-xl p-4 overflow-x-auto text-xs">{JSON.stringify(user, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
};

export default Profile;
