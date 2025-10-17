"use client"
import { useParams } from 'next/navigation';
import React from 'react';

const TenantUsers = () => {
    const { tenantId } = useParams();

    return (
        <div>
            tenantId: {tenantId}

            akon   akhane  tent  er sob  user dekanu  hobe  header a   total user  ...admin info tenet stust  etc  dekate  hobe 
            
        </div>
    );
};

export default TenantUsers;