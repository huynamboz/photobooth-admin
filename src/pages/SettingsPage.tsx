import Layout from "../components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BankSettings from "../components/BankSettings";
import { Building2, Settings as SettingsIcon } from "lucide-react";

function SettingsPage() {
  return (
    <Layout>
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Settings
            </h1>
            <p className="text-gray-600">
              Configure your PhotoBooth application settings.
            </p>
          </div>
          
          <div className="bg-white shadow rounded-lg">
            <Tabs defaultValue="bank" className="w-full">
              <div className="border-b px-6 pt-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="bank" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Bank Account
                  </TabsTrigger>
                  <TabsTrigger value="general" className="flex items-center gap-2" disabled>
                    <SettingsIcon className="h-4 w-4" />
                    General
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="bank" className="p-6">
                <BankSettings />
              </TabsContent>
              
              <TabsContent value="general" className="p-6">
                <div className="text-center py-12">
                  <SettingsIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">General Settings</h3>
                  <p className="mt-1 text-sm text-gray-500">Coming soon</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SettingsPage;
