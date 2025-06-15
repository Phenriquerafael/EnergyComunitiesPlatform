import React, { useEffect, useState } from "react";
import { Card, Spin, Button, Select } from "antd";
import { useList } from "@refinedev/core";
import CommunityDetails from "../../components/community/communityDetails";
import CommunityForm from "../../components/community/communityForm";

import { authProvider } from "../../authProvider";
import { ICommunityDTO, IUserDTO } from "../../interfaces";
import AlgorithmUploadSection from "../../components/Algorithms/algorithmSelection";

export const CommunityManagerPage = () => {
  const [user, setUser] = useState<IUserDTO | null>(null);
  const [selectedCommunityId, setSelectedCommunityId] = useState<string | null>(null);
  const [showCommunityForm, setShowCommunityForm] = useState(false);

  // Buscar o utilizador autenticado
  useEffect(() => {
    const fetchUser = async () => {
      const user = await authProvider.getIdentity?.() as IUserDTO;
      setUser(user || null);
    };
    fetchUser();
  }, []);

  // 
  useEffect(() => {
  if (showCommunityForm) {
    setSelectedCommunityId(null);
  }
}, [showCommunityForm]);


  // Obter todas as comunidades
  const { data: communitiesData, isLoading: isCommunitiesLoading } = useList<ICommunityDTO>({
    resource: "communities/all",
    queryOptions: { enabled: !!user },
  });

  if (!user || isCommunitiesLoading) {
    return <Spin />;
  }

  return (
    <Card title="Community Management" >
      {/* Seletor de comunidade */}
      <div style={{ marginBottom: 16 }} >
        <label style={{ fontWeight: "bold", marginRight: 8 }}>
          Choose a community:
        </label>

        <Select
          value={selectedCommunityId ?? ""}
          onChange={(value) => setSelectedCommunityId(value)}
          style={{ width: 200,marginBottom: 16 , marginRight: 8 }}
          placeholder="-- Select --"
        >
          {communitiesData?.data.map((community) => (
            <Select.Option key={community.id} value={community.id}>
              {community.name}
            </Select.Option>
          ))}
        </Select>
        <Button
          className="btn btn-neutral btn-sm"
          onClick={() => setShowCommunityForm((prev) => !prev)}
   
        >
          {showCommunityForm ? "Hide Create Form"  : "Create New Community"}
        </Button>
      </div>

      {/* Mostrar detalhes ou formulário */}
      {selectedCommunityId ? (
        <CommunityDetails communityId={selectedCommunityId} />
      ) : showCommunityForm ? (

        <CommunityForm userId={user.id ?? ""} />  
      ) : (
        <p>Please select a community or create a new one.</p>
      )}


    </Card>
  );
};

export default CommunityManagerPage;
