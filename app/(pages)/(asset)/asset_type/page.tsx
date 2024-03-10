import * as React from 'react';
import AssetTypeTable from '@/components/asset/asset_type/AssetTypeTable';

// material-ui 관련 임포트
import Box from '@mui/material/Box';

export default function EnhancedTable() {

  return (
    <Box sx={{ width: '100%' }}>
      {/* AssetTypeTable 컴포넌트 */}
      <AssetTypeTable />
    </Box>
  );
}
