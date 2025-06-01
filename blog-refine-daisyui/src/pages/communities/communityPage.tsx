import React, { useEffect, useState } from "react";
import { Card, Spin, Button } from "antd";
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
    <Card title="Community Management">
      {/* Seletor de comunidade */}
      <div style={{ marginBottom: 16 }}>
        <strong>Select a community:</strong>{" "}
        <select
          value={selectedCommunityId ?? ""}
          onChange={(e) => setSelectedCommunityId(e.target.value)}
          style={{ marginLeft: 8 }}
        >
          <option value="">-- Select --</option>
          {communitiesData?.data.map((community) => (
            <option key={community.id} value={community.id}>
              {community.name}
            </option>
          ))}
        </select>
        <Button
          type="default"
          onClick={() => setShowCommunityForm((prev) => !prev)}
          style={{ marginLeft: 16 }}
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
