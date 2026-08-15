package com.sumeetsingh.resolveai.incident.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sumeetsingh.resolveai.ai.document.FileContentExtractor;
import com.sumeetsingh.resolveai.incident.document.IncidentAttachment;
import com.sumeetsingh.resolveai.incident.repository.IncidentAttachmentRepository;
import com.sumeetsingh.resolveai.project.entity.ProjectMember;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;
import com.sumeetsingh.resolveai.project.repository.ProjectMemberRepository;
import com.sumeetsingh.resolveai.support.repository.SupportRequestRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncidentAttachmentService {

    private final GridFsTemplate gridFsTemplate;
    private final IncidentAttachmentRepository attachmentRepository;

    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final SupportRequestRepository supportRequestRepository;

    private final FileContentExtractor fileContentExtractor;

    public IncidentAttachment uploadFile(
            Long supportRequestId,
            MultipartFile file,
            String username
    ) throws IOException {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        var supportRequest =
                supportRequestRepository.findById(supportRequestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Support request not found"
                                )
                        );

        Long projectId =
                supportRequest.getProject().getProjectId();

        ProjectMember member =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                projectId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "You do not have access to this project"
                                )
                        );

        if (member.getStatus() != ProjectMemberStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "You are not an active project member"
            );
        }

        if (file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Uploaded file is empty"
            );
        }

        /*
         * Store the original file in MongoDB GridFS.
         */
        ObjectId gridFsFileId = gridFsTemplate.store(
                file.getInputStream(),
                file.getOriginalFilename(),
                file.getContentType()
        );

        /*
         * Extract text from supported text-based files.
         *
         * The actual file remains in GridFS.
         * The extracted text is stored separately so
         * the AI can use it later.
         */
        String extractedText = null;

        if (file.getContentType() != null
                && (
                file.getContentType().equals("text/plain")
                        || file.getContentType().equals("application/json")
                        || file.getContentType().equals("text/csv")
        )) {

            try {

                extractedText =
                        fileContentExtractor.extractText(
                                file.getInputStream()
                        );

            } catch (Exception e) {

                throw new IllegalArgumentException(
                        "Unable to extract file content",
                        e
                );
            }
        }

        /*
         * Store metadata + extracted text.
         */
        IncidentAttachment attachment =
                IncidentAttachment.builder()
                        .supportRequestId(supportRequestId)
                        .projectId(projectId)
                        .uploadedBy(user.getUserId())
                        .fileName(file.getOriginalFilename())
                        .contentType(file.getContentType())
                        .fileSize(file.getSize())
                        .gridFsFileId(
                                gridFsFileId.toHexString()
                        )
                        .extractedText(extractedText)
                        .uploadedAt(LocalDateTime.now())
                        .build();

        return attachmentRepository.save(attachment);
    }

    public List<IncidentAttachment> getAttachments(
            Long supportRequestId,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        var supportRequest =
                supportRequestRepository.findById(supportRequestId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Support request not found"
                                )
                        );

        Long projectId =
                supportRequest.getProject().getProjectId();

        projectMemberRepository
                .findByProjectProjectIdAndUserUserId(
                        projectId,
                        user.getUserId()
                )
                .filter(member ->
                        member.getStatus()
                                == ProjectMemberStatus.ACTIVE
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "You do not have access to this project"
                        )
                );

        return attachmentRepository
                .findBySupportRequestId(
                        supportRequestId
                );
    }
}