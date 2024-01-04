import Avatar from "@/app/users/components/Avatar";
import {
  Card,
  CardHeader,
  CardContent
} from "@/components/ui/card";
import { RoleGate } from "@/components/auth/role-gate";
import { UserRole } from "@prisma/client";

const ManageUsers = () => {
  return ( 
    
      
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
        👥 Manage Users
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <div className="flex gap-x-2">
            <Avatar />
            <p className="font-semibold">
              User Name
            </p>
            <p className="font-semibold">
              useremail@email.com
            </p>
          </div>
        </RoleGate>
      </CardContent>
    </Card>
   );
}
 
export default ManageUsers;