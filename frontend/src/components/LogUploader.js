import useUploadStore from '../stores/uploadStore';

const handleFileUpload = async (file) => {
  // ... 기존 코드 ...

  try {
    // 파일 읽기
    const fileContent = await readFileAsText(file);

    // 파일 파싱 후 로그 데이터와 통계 정보 생성
    const parsedLogs = parseLogFile(fileContent);
    const stats = calculateStats(parsedLogs);

    // 스토어에 업로드된 파일, 통계 정보, 로그 데이터 저장
    useUploadStore.getState().setUploadedFile(file);
    useUploadStore.getState().setStats(stats);
    useUploadStore.getState().setLogs(parsedLogs); // 로그 데이터 저장

    // ... 기존 코드 ...
  } catch (error) {
    console.error('Error processing file:', error);
    // 에러 처리
  }
};
