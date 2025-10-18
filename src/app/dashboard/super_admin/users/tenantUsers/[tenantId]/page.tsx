"use client"
import { getAllTenantUsers } from '@/lib/allApiRequest/userRequest';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import React from 'react';

const TenantUsers = () => {
    const { tenantId } = useParams();
    const { data } = useQuery({
        queryKey: ['tenantUsers', tenantId],
        queryFn: async ({ queryKey }) => {
            // derive the id from the queryKey so it's treated as a string
            const id = queryKey[1] as string;
            const res = await getAllTenantUsers(id);
            return res;
        },
        // only run the query when tenantId is available
        enabled: !!tenantId,
    });
    console.log(data);
    return (
        <div>
            tenantId: {tenantId}

            akon   akhane  tent  er sob  user dekanu  hobe  header a   total user  ...admin info tenet stust  etc  dekate  hobe 

        </div>
    );
};

export default TenantUsers;