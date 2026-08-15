package com.sumeetsingh.resolveai.ai.document;

import java.io.InputStream;

import org.apache.tika.Tika;
import org.springframework.stereotype.Component;

@Component
public class FileContentExtractor {

    private final Tika tika = new Tika();

    public String extractText(InputStream inputStream)
            throws Exception {

        return tika.parseToString(inputStream);
    }
}