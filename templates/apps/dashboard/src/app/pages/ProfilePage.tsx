import { useUser } from '@<%= projectName %>/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Button } from '@<%= projectName %>/ui';

export default function ProfilePage() {
  const user = useUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              type="text"
              defaultValue={user?.name || ''}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              defaultValue={user?.email || ''}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Contact support to change your email
            </p>
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}
