import React, { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { useList, useOne } from "@refinedev/core";
import CommunityDetails from "../../components/community/communityDetails";
import CommunityForm from "../../components/community/communityForm";
import { authProvider } from "../../authProvider";
import { ICommunityDTO, ICommunityManagerDTO, IUserDTO } from "../../interfaces";


export const CommunityManagerPage = () => {
  const [user, setUserId] = useState<IUserDTO | null>(null);
  const [communityId, setCommunityId] = useState<string | null>(null);

// Obtenção do userId atual usando o authProvider do refine
useEffect(() => {
    const fetchUserId = async () => {
        const  user   = await authProvider.getIdentity?.() as IUserDTO;
        setUserId(user || null);
    };
    fetchUserId();
}, []);

  // Busca o CommunityManager associado ao userId
  const { data: communityManagerData, isLoading: isCommunityManagerLoading } = useList<ICommunityManagerDTO>({
    resource: user?.id ?`communityManager/user/${user.id }`:"",

    queryOptions: {
      enabled: !!user?.id ,
    },
  });

  useEffect(() => {
    if (communityManagerData/*  && communityManagerData?.data?.length > 0 */) {
      console.log("Community Manager Data:", communityManagerData.data);
      setCommunityId(communityManagerData.data.communityId ?? null);
    }
  }, [communityManagerData]);

  if (!user || isCommunityManagerLoading) {
    return <Spin />;
  }

  return (
    <Card title="Gestão de Comunidade">
      {communityId ? (
        <CommunityDetails communityId={communityId} />
      ) : (
        <CommunityForm userId={user.id as string} />
      )}
    </Card>
  );
};

export default CommunityManagerPage;
